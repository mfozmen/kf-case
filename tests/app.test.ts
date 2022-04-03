import App from "../src/app";
import Device from "../src/models/Device";
import EnhancedOutage from "../src/models/EnhancedOutage";
import Outage from "../src/models/Outage";
import SiteInfo from "../src/models/SiteInfo";
import SiteOutageService from "../src/services/SiteOutageService";
import createMockInstance from "jest-create-mock-instance";
import { faker } from "@faker-js/faker";

describe("App tests", () => {
  let siteOutageService: jest.Mocked<SiteOutageService> =
    createMockInstance(SiteOutageService);
  let devices: Device[];
  let outages: Outage[];
  let siteInfo: SiteInfo;
  let enhancedOutages: EnhancedOutage[];
  beforeEach(() => {
    devices = [
      {
        id: faker.datatype.uuid().toString(),
        name: faker.datatype.string(),
      },
      {
        id: faker.datatype.uuid().toString(),
        name: faker.datatype.string(),
      },
    ];

    outages = [
      {
        id: devices[0].id,
        begin: faker.datatype.datetime({
          min: new Date("2022-01-01T00:00:00.000Z").valueOf(),
        }),
        end: faker.datatype.datetime(),
      },
      {
        id: devices[1].id,
        begin: faker.datatype.datetime({
          max: new Date("2022-01-01T00:00:00.000Z").valueOf(),
        }),
        end: faker.datatype.datetime(),
      },
    ];

    siteInfo = {
      id: faker.datatype.string(),
      name: faker.datatype.string(),
      devices,
    };

    enhancedOutages = [
      {
        id: outages[0].id,
        name: devices[0].name,
        begin: outages[0].begin,
        end: outages[0].end,
      },
    ];
  });

  test("updates site outages successfully", async () => {
    // Arrange
    jest.resetAllMocks();

    jest
      .spyOn(siteOutageService, "getOutages")
      .mockImplementation(() => Promise.resolve(outages));

    jest
      .spyOn(siteOutageService, "getSiteInfo")
      .mockImplementation(() => Promise.resolve(siteInfo));

    const postSiteOutagesFn = jest
      .spyOn(siteOutageService, "postSiteOutages")
      .mockImplementation(() => Promise.resolve());

    // Act
    const app = new App(siteOutageService);
    const result = await app.main();

    // Assert
    expect(postSiteOutagesFn).toHaveBeenCalledTimes(1);
    expect(result).toEqual(0);
  });

  test("creates enhanced outages properly", () => {
    // Act
    const app = new App(siteOutageService);
    const result = app.createEnhancedOutages(outages, siteInfo);

    // Assert
    expect(result).toEqual(enhancedOutages);
  });
});
