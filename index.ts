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

const githubPagesAAAARecords = [
    "2606:50c0:8000::153",
    "2606:50c0:8001::153",
    "2606:50c0:8002::153",
    "2606:50c0:8003::153",
];

const recordList = [
    {
        name: "docs",
        value: "octostack.github.io",
        type: "CNAME",
    }
];

githubPagesARecords.forEach((value) => {
    recordList.push({
        name: "@",
        value: value,
        type: "A",
    });
});

githubPagesAAAARecords.forEach((value) => {
    recordList.push({
        name: "@",
        value: value,
        type: "AAAA",
    });
});

// Set up an A record within the DNS Zone
recordList.forEach((record, i) => {
    const _ = new cloudflare.Record(record.name + i, {
        zoneId: primaryZone.then(primaryZone => primaryZone.id),
        name: record.name,
        value: record.value,
        type: record.type,
    });
});
