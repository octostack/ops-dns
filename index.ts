import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

// Create a config object
const config = new pulumi.Config();

// Get zoneName from the config
let zoneId = config.require("zoneId");

// Set up an A record within the DNS Zone
const primaryRecord = new cloudflare.Record("primaryRecord", {
    zoneId: zoneId,
    name: "test",
    value: "192.168.0.11",
    type: "A",
});
