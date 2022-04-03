import "reflect-metadata";
import "dotenv/config";

import Container from "typedi";
import EnhancedOutage from "./models/EnhancedOutage";
import Outage from "../src/models/Outage";
import SiteInfo from "./models/SiteInfo";
import SiteOutageService from "./services/SiteOutageService";

export default class App {
  constructor(private readonly siteOutageService: SiteOutageService) {}
  async main() {
    try {
      const siteId = "norwich-pear-tree";

      const outages: Outage[] = await this.siteOutageService.getOutages();
      const siteInfo: SiteInfo = await this.siteOutageService.getSiteInfo(
        siteId
      );

      const enhancedOutages = this.createEnhancedOutages(outages, siteInfo);

      await this.siteOutageService.postSiteOutages(siteId, enhancedOutages);

      console.log("Site outages posted successfully.");

      return 0;
    } catch (err) {
      console.error(err);
      return -1;
    }
  }

  createEnhancedOutages(
    outages: Outage[],
    siteInfo: SiteInfo
  ): EnhancedOutage[] {
    const filteredOutages = outages.filter(
      (o) =>
        new Date(o.begin) >= new Date("2022-01-01T00:00:00.000Z") &&
        siteInfo.devices.map((d) => d.id).includes(o.id)
    );

    const enhancedOutages = filteredOutages.map<EnhancedOutage>((o) => {
      return {
        id: o.id,
        name: siteInfo.devices.find((d) => d.id == o.id)!.name,
        begin: o.begin,
        end: o.end,
      };
    });

    return enhancedOutages;
  }
}
