import axios from "axios"

const WORDPRESS_BASE_URL = "https://store.glamup.pk"

// Central axios client; keep generous timeout for WP (some hosts can be slow)
const wpApi = axios.create({
  baseURL: WORDPRESS_BASE_URL,
  timeout: 12000, // 12s default timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Logging for visibility
wpApi.interceptors.request.use(
  (config) => {
    const url = `${config.baseURL}${config.url}`
    console.log(`🌐 WordPress request: ${url}`)
    if (config.headers.Authorization) {
      console.log(`   With Bearer: ${String(config.headers.Authorization).slice(0, 16)}...`)
    }
    return config
  },
  (error) => {
    console.error("❌ WP request error:", error?.message || error)
    return Promise.reject(error)
  },
)

export interface WordPressUser {
  id: number
  username: string
  name: string
  email: string
  first_name: string
  last_name: string
  roles: string[]
  meta?: Record<string, any>
}

export interface RegisterUserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  password: string
  agreeToTerms: boolean
  marketingConsent: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface JWTResponse {
  token: string
  user_email: string
  user_nicename: string
  user_display_name: string
}

export interface UserProfile {
  id: number
  email: string
  name: string
  firstName: string
  lastName: string
  phone: string
  address?: string
  city?: string
  dateOfBirth?: string
  emergencyContact?: string
  marketingConsent: boolean
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  email?: string
  meta?: {
    phone_number?: string
    address?: string
    city?: string
    date_of_birth?: string
    emergency_contact?: string
    marketing_consent?: string
  }
}

const handleApiError = (error: any, context: string) => {
  console.error(`❌ Error in ${context}:`, error?.message || error)
  if (error?.response) {
    const msg = error.response?.data?.message || `HTTP ${error.response.status}`
    throw new Error(msg)
  }
  if (error?.request) {
    throw new Error("No response from server.")
  }
  throw new Error(String(error))
}

export const registerUser = async (userData: RegisterUserData) => {
  // NOTE: kept as-is from previous versions; not directly relevant to orders.
  const adminCredentials = {
    username: "apiadmin",
    password: "APIAdminPass@03473579448",
  }

  try {
    const tokenResponse = await wpApi.post<JWTResponse>("/wp-json/jwt-auth/v1/token", adminCredentials)
    const adminToken = tokenResponse.data.token
    if (!adminToken) throw new Error("Failed to obtain admin token.")

    const emailPrefix = userData.email.split("@")[0].replace(/[^a-z0-9]/gi, "")
    const cleanFirstName = userData.firstName.toLowerCase().replace(/[^a-z0-9]/g, "")
    const cleanLastName = userData.lastName.toLowerCase().replace(/[^a-z0-9]/g, "")
    const timestamp = Date.now().toString().slice(-4)
    const username = `${cleanFirstName}${cleanLastName}${timestamp}`.substring(0, 20) || `${emailPrefix}${timestamp}`

    const payload = {
      username,
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
      roles: ["customer"],
      meta: {
        phone_number: userData.phone,
        address: userData.address,
        city: userData.city,
        marketing_consent: userData.marketingConsent ? "yes" : "no",
        terms_accepted: userData.agreeToTerms ? "yes" : "no",
        registration_date: new Date().toISOString(),
      },
    }

    const createUserResponse = await wpApi.post<WordPressUser>("/wp-json/wp/v2/users", payload, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    return createUserResponse.data
  } catch (error) {
    handleApiError(error, "registerUser")
  }
}

export const loginUser = async (credentials: LoginCredentials): Promise<JWTResponse> => {
  try {
    const response = await wpApi.post<JWTResponse>("/wp-json/jwt-auth/v1/token", credentials)
    return response.data
  } catch (error: any) {
    if (
      error?.response &&
      (error.response.data?.code === "[jwt_auth] invalid_username" ||
        error.response.data?.code === "[jwt_auth] invalid_password" ||
        error.response.data?.code === "[jwt_auth] invalid_email")
    ) {
      throw new Error("Invalid email or password.")
    }
    handleApiError(error, "loginUser")
  }
  throw new Error("Login failed")
}

export const autoLoginAfterRegistration = async (
  email: string,
  password: string
): Promise<JWTResponse | null> => {
  try {
    // Allow a short delay for WordPress to finish persisting the new user
    await new Promise((resolve) => setTimeout(resolve, 800));
    const jwt = await loginUser({ username: email, password });
    return jwt;
  } catch (error) {
    console.error("❌ autoLoginAfterRegistration failed:", error);
    return null;
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  if (!token) return false
  try {
    await wpApi.post("/wp-json/jwt-auth/v1/token/validate", {}, { headers: { Authorization: `Bearer ${token}` } })
    return true
  } catch (error) {
    console.warn("Token validation failed")
    return false
  }
}

// Retry helper
async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 600): Promise<T> {
  let lastErr: any
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const delay = baseDelayMs * Math.pow(2, i)
      console.warn(`Retry ${i + 1}/${attempts} after error:`, (err as any)?.message || err)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw lastErr
}

export const getUserProfile = async (token: string): Promise<UserProfile | null> => {
  try {
    const response = await withRetry(
      () =>
        wpApi.get<WordPressUser>("/wp-json/wp/v2/users/me?context=edit", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      3,
      600,
    )

    const userData = response.data
    const meta = userData.meta || {}
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: meta.phone_number || "",
      address: meta.address || "",
      city: meta.city || "",
      dateOfBirth: meta.date_of_birth || "",
      emergencyContact: meta.emergency_contact || "",
      marketingConsent: meta.marketing_consent === "yes",
    }
  } catch (error: any) {
    console.error("❌ Error fetching user profile:", error?.message || error)
    return null
  }
}
