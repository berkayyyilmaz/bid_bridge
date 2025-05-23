import api from '@/lib/api';

// Define the auth service interfaces
interface LoginRequestDTO {
  email: string;
  password: string;
}

interface LoginResponseDTO {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
}

interface RegisterRequestDTO {
  companyName: string;
  email: string;
  password: string;
  fullName: string;
}

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await api.post<LoginResponseDTO>('/auth/login', credentials);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_info', JSON.stringify({
          userId: response.data.userId,
          email: response.data.email,
          fullName: response.data.fullName,
          roles: response.data.roles,
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new company and admin user
   */
  async register(data: RegisterRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await api.post<LoginResponseDTO>('/auth/register', data);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_info', JSON.stringify({
          userId: response.data.userId,
          email: response.data.email,
          fullName: response.data.fullName,
          roles: response.data.roles,
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    // Redirect to login page is handled by the API interceptor
  }

  /**
   * Check if the user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get the current user info
   */
  getUserInfo(): { userId: string; email: string; fullName: string; roles: string[] } | null {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }
}

export default new AuthService(); 