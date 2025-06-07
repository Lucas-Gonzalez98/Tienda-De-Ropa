import Footer from "./Footer.tsx";
import {useAuth} from "../../context/AuthContext.tsx";

function FooterWrapper() {
    const { isAdmin, loading } = useAuth();

    if (loading) return null; // o un spinner si querés

    return !isAdmin ? <Footer /> : null;
}
export default FooterWrapper;