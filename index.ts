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

// Set up an A record within the DNS Zone
const primaryRecord = new cloudflare.Record("primaryRecord", {
    zoneId: primaryZone.then(primaryZone => primaryZone.id),
    name: "test",
    value: "192.168.0.11",
    type: "A",
});
