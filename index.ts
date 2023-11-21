import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

// Create a config object
const config = new pulumi.Config();

// Get zoneName from the config
const zoneName = config.require("zoneName");

// Extract the zoneId from the zoneName
const primaryZone = cloudflare.getZone({
    name: zoneName,
});

const githubPagesARecords = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
];

githubPagesARecords.forEach((value, i) => {
    const _ = new cloudflare.Record("githubPagesA" + i, {
        zoneId: primaryZone.then(primaryZone => primaryZone.id),
        name: "@",
        value: value,
        type: "A",
    });
});


const githubPagesAAAARecords = [
    "2606:50c0:8000::153",
    "2606:50c0:8001::153",
    "2606:50c0:8002::153",
    "2606:50c0:8003::153",
];

githubPagesAAAARecords.forEach((value, i) => {
    const _ = new cloudflare.Record("githubPagesAAAA" + i, {
        zoneId: primaryZone.then(primaryZone => primaryZone.id),
        name: "@",
        value: value,
        type: "AAAA",
    });
});

// All other DNS Records
const recordList = [
    {
        name: "www",
        value: "@",
        type: "CNAME",
        proxied: false,
    },
    {
        name: "docs",
        value: "octostack.github.io",
        type: "CNAME",
    }
];

recordList.forEach((record) => {
    const _ = new cloudflare.Record(record.name + "." + zoneName, {
        zoneId: primaryZone.then(primaryZone => primaryZone.id),
        name: record.name,
        value: record.value,
        type: record.type,
        proxied: record.proxied? record.proxied : false,
    });
});
