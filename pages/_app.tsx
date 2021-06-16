// Файл оборавчивает все страницы redux provider`ом
import App, {AppContext} from "next/app";
import {wrapper} from "../redux/store";

class MyApp extends App {
    static async getInitialProps({Component, ctx}: AppContext) {
        const pageProps = Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {};

        return {pageProps};
    }

    render() {
        const {Component, pageProps} = this.props;

        return (
            <Component {...pageProps} />
        )
    }
}

export default wrapper.withRedux(MyApp);