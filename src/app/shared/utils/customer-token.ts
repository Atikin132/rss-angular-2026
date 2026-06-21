export function getCustomerToken(requiredScope: string): string {
  const token = sessionStorage.getItem('accessToken') ?? localStorage.getItem('accessToken');
  const scope = sessionStorage.getItem('scope') ?? localStorage.getItem('scope');

  if (!token) {
    throw new Error('Customer access token not found');
  }

  if (!scope?.includes(requiredScope) || !scope.includes('customer_id:')) {
    throw new Error(`Customer token has insufficient scope: ${scope ?? 'empty'}`);
  }

  return token;
}
