import axios, { AxiosInstance } from "axios";

import EnhancedOutage from "../models/EnhancedOutage";
import Outage from "../models/Outage";
import { Service } from "typedi";
import SiteInfo from "../models/SiteInfo";
import axiosRetry from "axios-retry";

const REQUEST_RETRY_COUNT = 3;

@Service()
export default class SiteOutageService {
  client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: process.env.SITE_OUTAGE_API_BASE_URL,
      headers: { "x-api-key": process.env.SITE_OUTAGE_API_API_KEY as string },
    });

    axiosRetry(this.client, { retries: REQUEST_RETRY_COUNT });
  }

  async getOutages(): Promise<Outage[]> {
    return this.client.get("/outages").then((response) => response.data);
  }

  async getSiteInfo(siteId: string): Promise<SiteInfo> {
    return this.client
      .get(`/site-info/${siteId}`)
      .then((response) => response.data);
  }

  async postSiteOutages(
    siteId: string,
    enhancedOutages: EnhancedOutage[]
  ): Promise<void> {
    return this.client
      .post(`/site-outages/${siteId}`, enhancedOutages)
      .then((response) => response.data);
  }
}
