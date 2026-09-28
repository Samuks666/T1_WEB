// Middleware que verifica se o usuário está logado como admin
export const isAdmin = (req, res, next) => {
    if (req.session && req.session.adminLogado) {
        return next(); // Está autenticado, pode passar
    }
    // Não está autenticado, manda de volta para o login
    res.redirect('/login');
};