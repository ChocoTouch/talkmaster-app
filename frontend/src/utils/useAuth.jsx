import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Identifiants invalides');

      const data = await res.json();
      const { access_token } = data;

      const tokenData = JSON.parse(atob(access_token.split('.')[1]));
      const role = tokenData.role || tokenData.nom_role;

      localStorage.setItem('token', access_token);

      if (role === 'CONFÉRENCIER') {
        navigate('/dashboard/talks');
      } else if (role === 'ORGANISATEUR') {
        navigate('/dashboard/organisation');
      } else {
        console.error("Rôle inconnu : ", role);
      }

    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      throw err;
    }
  };

  return { loginUser };
};
