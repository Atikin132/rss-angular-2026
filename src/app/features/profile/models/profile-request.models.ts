export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
