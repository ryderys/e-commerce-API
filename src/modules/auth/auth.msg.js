const AuthMSG = {
    OTPNotExpired: "your code has not been expired yet!",
    OTPExpired: "your code has been expired!",
    OTPSuccess: "code has been sent successfully!",
    InvalidOTP: "Invalid code entered!",
    OTPCooldown: "Please wait for 30s before requesting another OTP!",
    UserNotFound: "User  not found. Please log in again.",
    LoginSuccess: "Login successful!",
    Login: "Please login to continue!",
    LogoutSuccess: "Logout successful!",
    InvalidRefreshToken: "The provided refresh token is invalid or has expired.",
    RefreshTokenMissing: "Refresh token is missing. Please log in again",
    TokenRefreshed: "Access token has been successfully refreshed.",
    TokenRevoked: 'The refresh token has been revoked. Please log in again.'

}

module.exports = {
    AuthMSG
}