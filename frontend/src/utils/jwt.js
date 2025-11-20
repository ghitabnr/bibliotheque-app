// Utilitaires pour gérer le JWT (décodage basique côté client)
export const jwtUtils = {
  // Décoder le token JWT (partie payload)
  decodeToken: (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  },

  // Vérifier si le token est expiré
  isTokenExpired: (token) => {
    const decoded = jwtUtils.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },

  // Vérifier la validité du token
  isValidToken: (token) => {
    return token && !jwtUtils.isTokenExpired(token);
  },
};