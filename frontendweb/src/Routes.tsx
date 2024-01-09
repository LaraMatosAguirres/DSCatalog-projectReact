import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalog from './pages/Catalog';
import Admin from './pages/Admin';
import ProductDatails from './pages/ProductDatails';

const Routes = () => {
    return(
        <BrowserRouter>
            <Navbar />
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/products" exact>
                    <Catalog />
                </Route>
                <Route path="/products/:productId">
                    <ProductDatails />
                </Route>
                <Route path="/admin">
                    <Admin />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;