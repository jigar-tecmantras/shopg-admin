export default function authHeader(): {Authorization?: string} {
  const obj = JSON.parse(localStorage.getItem('authUser') ?? '');

  if (obj?.accessToken != null) {
    return {Authorization: obj.accessToken};
  } else {
    return {};
  }
}
