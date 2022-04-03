import App from "./app";
import Container from "typedi";
import SiteOutageService from "./services/SiteOutageService";

new App(Container.get(SiteOutageService)).main();
