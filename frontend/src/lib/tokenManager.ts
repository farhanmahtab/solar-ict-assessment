import { jwtDecode } from 'jwt-decode';
import api from './api';

interface JWTPayload {
  sub: number;
  username: string;
  role: string;
  email: string;
  createdAt: string;
  iat: number;
  exp: number;
}

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private readonly REFRESH_BUFFER_MS = 60000; // Refresh 1 minute before expiration


  private decodeToken(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  private getTimeUntilExpiration(token: string): number | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    return timeUntilExpiration;
  }

  private async refreshTokens(): Promise<void> {
    if (this.isRefreshing) {
      console.log('[TokenManager] Refresh already in progress, skipping...');
      return;
    }

    this.isRefreshing = true;
    console.log('[TokenManager] Proactively refreshing tokens...');

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.warn('[TokenManager] No refresh token found');
        this.clearRefreshTimer();
        return;
      }

      const { data } = await api.post('/auth/refresh', { refreshToken });
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      console.log('[TokenManager] Tokens refreshed successfully');

      // Schedule next refresh with the new access token
      this.scheduleTokenRefresh(data.accessToken);
    } catch (error) {
      console.error('[TokenManager] Failed to refresh tokens:', error);
      
      // Clear tokens and redirect to login on failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.clearRefreshTimer();
      
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  public scheduleTokenRefresh(accessToken: string): void {
    this.clearRefreshTimer();

    const timeUntilExpiration = this.getTimeUntilExpiration(accessToken);
    
    if (!timeUntilExpiration || timeUntilExpiration <= 0) {
      console.warn('[TokenManager] Token already expired or invalid');
      return;
    }

    // Calculate when to refresh (1 minute before expiration)
    const refreshTime = Math.max(timeUntilExpiration - this.REFRESH_BUFFER_MS, 0);

    console.log(
      `[TokenManager] Scheduling token refresh in ${Math.floor(refreshTime / 1000)} seconds`
    );

    this.refreshTimer = setTimeout(() => {
      this.refreshTokens();
    }, refreshTime);
  }

  /**
   * Clear the refresh timer
   */
  public clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
      console.log('[TokenManager] Refresh timer cleared');
    }
  }

  /**
   * Initialize token manager with current access token
   */
  public initialize(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      this.scheduleTokenRefresh(accessToken);
    }
  }

  /**
   * Clean up on logout
   */
  public cleanup(): void {
    this.clearRefreshTimer();
    this.isRefreshing = false;
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
