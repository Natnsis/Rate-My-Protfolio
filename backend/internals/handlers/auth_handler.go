package handlers

import (
	"errors"
	"net/http"
	"regexp"
	"strings"

	"foliohub/internals/auth"
	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var usernameRe = regexp.MustCompile(`^[a-zA-Z0-9_]{3,24}$`)

type registerRequest struct {
	Username string `json:"username" binding:"required" example:"ariac"`
	Email    string `json:"email" binding:"required,email" example:"aria@devfolio.dev"`
	Password string `json:"password" binding:"required,min=8" example:"password123"`
	Name     string `json:"name" example:"Aria Chen"`
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type authResponse struct {
	Token string     `json:"token"`
	User  UserPublic `json:"user"`
}

// Register creates a new account and returns a JWT.
//
//	@Summary		Create an account
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		registerRequest	true	"New account details"
//	@Success		201		{object}	authResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		409		{object}	map[string]string
//	@Router			/auth/register [post]
func (h *Handler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}
	req.Username = strings.ToLower(strings.TrimSpace(req.Username))
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if !usernameRe.MatchString(req.Username) {
		fail(c, http.StatusBadRequest, "username must be 3-24 letters, numbers or underscores")
		return
	}
	if strings.TrimSpace(req.Name) == "" {
		req.Name = req.Username
	}

	var existing int64
	h.DB.Model(&db.User{}).Where("email = ? OR username = ?", req.Email, req.Username).Count(&existing)
	if existing > 0 {
		fail(c, http.StatusConflict, "an account with that email or username already exists")
		return
	}

	hash, err := auth.HashPassword(req.Password)
	if err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}

	user := db.User{Username: req.Username, Email: req.Email, PasswordHash: hash, Name: req.Name, Role: "Developer"}
	if err := h.DB.Create(&user).Error; err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}

	token, err := h.JWT.Generate(user.ID)
	if err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusCreated, authResponse{Token: token, User: toUserPublic(user)})
}

// Login authenticates a user by email and password.
//
//	@Summary		Log in
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		loginRequest	true	"Credentials"
//	@Success		200		{object}	authResponse
//	@Failure		401		{object}	map[string]string
//	@Router			/auth/login [post]
func (h *Handler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}

	var user db.User
	err := h.DB.Where("email = ?", strings.ToLower(strings.TrimSpace(req.Email))).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) || (err == nil && !auth.CheckPassword(user.PasswordHash, req.Password)) {
		fail(c, http.StatusUnauthorized, "invalid email or password")
		return
	}
	if err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}

	token, err := h.JWT.Generate(user.ID)
	if err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, authResponse{Token: token, User: toUserPublic(user)})
}

// Me returns the authenticated user's profile.
//
//	@Summary		Current user
//	@Tags			auth
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	UserPublic
//	@Failure		401	{object}	map[string]string
//	@Router			/auth/me [get]
func (h *Handler) Me(c *gin.Context) {
	var user db.User
	if err := h.DB.First(&user, currentUserID(c)).Error; err != nil {
		fail(c, http.StatusNotFound, "user not found")
		return
	}
	c.JSON(http.StatusOK, toUserPublic(user))
}
