package auth

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const userIDKey = "authUserID"

// RequireAuth rejects the request with 401 unless a valid Bearer JWT is present,
// otherwise it stores the authenticated user id on the context.
func RequireAuth(m *Manager) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := userIDFromRequest(c, m)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid authorization token"})
			return
		}
		c.Set(userIDKey, userID)
		c.Next()
	}
}

// OptionalAuth attaches the authenticated user id when a valid token is
// present, but never blocks the request — used on public reads that adjust
// their response for a logged-in viewer (e.g. "liked by me").
func OptionalAuth(m *Manager) gin.HandlerFunc {
	return func(c *gin.Context) {
		if userID, ok := userIDFromRequest(c, m); ok {
			c.Set(userIDKey, userID)
		}
		c.Next()
	}
}

func userIDFromRequest(c *gin.Context, m *Manager) (uint, bool) {
	header := c.GetHeader("Authorization")
	if header == "" || !strings.HasPrefix(header, "Bearer ") {
		return 0, false
	}
	tokenString := strings.TrimPrefix(header, "Bearer ")
	claims, err := m.Parse(tokenString)
	if err != nil {
		return 0, false
	}
	return claims.UserID, true
}

// UserID reads the authenticated user id set by RequireAuth/OptionalAuth.
func UserID(c *gin.Context) (uint, bool) {
	v, ok := c.Get(userIDKey)
	if !ok {
		return 0, false
	}
	id, ok := v.(uint)
	return id, ok
}
