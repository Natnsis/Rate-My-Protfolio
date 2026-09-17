package auth

import (
	"testing"
	"time"
)

func TestHashPasswordRoundTrip(t *testing.T) {
	hash, err := HashPassword("correct horse battery staple")
	if err != nil {
		t.Fatalf("HashPassword error: %v", err)
	}
	if hash == "correct horse battery staple" {
		t.Fatal("hash equals plaintext")
	}
	if !CheckPassword(hash, "correct horse battery staple") {
		t.Error("CheckPassword rejected the correct password")
	}
	if CheckPassword(hash, "wrong password") {
		t.Error("CheckPassword accepted a wrong password")
	}
}

func TestHashPasswordIsSalted(t *testing.T) {
	first, _ := HashPassword("same input")
	second, _ := HashPassword("same input")
	if first == second {
		t.Error("identical passwords produced identical hashes; bcrypt salt missing")
	}
}

func TestJWTRoundTrip(t *testing.T) {
	m := NewManager("unit-test-secret", time.Hour)
	token, err := m.Generate(42)
	if err != nil {
		t.Fatalf("Generate error: %v", err)
	}
	claims, err := m.Parse(token)
	if err != nil {
		t.Fatalf("Parse error: %v", err)
	}
	if claims.UserID != 42 {
		t.Errorf("UserID = %d, want 42", claims.UserID)
	}
	if claims.Subject != "foliohub-access" {
		t.Errorf("Subject = %q, want foliohub-access", claims.Subject)
	}
}

func TestJWTRejectsWrongSecret(t *testing.T) {
	issuer := NewManager("secret-a", time.Hour)
	token, _ := issuer.Generate(1)

	verifier := NewManager("secret-b", time.Hour)
	if _, err := verifier.Parse(token); err == nil {
		t.Fatal("Parse accepted a token signed with a different secret")
	}
}

func TestJWTRejectsExpired(t *testing.T) {
	m := NewManager("unit-test-secret", -time.Hour)
	token, _ := m.Generate(1)
	if _, err := m.Parse(token); err == nil {
		t.Fatal("Parse accepted an expired token")
	}
}

func TestJWTRejectsGarbage(t *testing.T) {
	m := NewManager("unit-test-secret", time.Hour)
	if _, err := m.Parse("not-a-token"); err == nil {
		t.Fatal("Parse accepted a malformed token")
	}
}