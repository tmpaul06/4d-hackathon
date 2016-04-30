var os = require("os");
var execSync = require('child_process').execSync;

function getIp() {
  var ifaces = os.networkInterfaces();
  var ipAddress;
  try {
    ipAddress = checkBoot2DockerIp();
  } catch (e) {
    console.log(e);
  }

  if(!ipAddress) {
    Object.keys(ifaces).forEach(function(ifname) {
      var alias = 0;
      // Ignore docker interface
      if(/docker/g.test(ifname)) {
        return;
      }
      ifaces[ifname].forEach(function(iface) {
        if((iface.family !== "IPv4") || (iface.internal !== false)) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if(alias >= 1) {
          // this single interface has multiple ipv4 addresses
          throw new Error("Multiple IP addresses found. Please choose one and insert it in gulp config.");
        } else {
          // this interface has only one ipv4 adress
          ipAddress = iface.address;
          console.log("Detected IP Address:", ipAddress);
        }
      });
    });
    if(ipAddress === null) {
      throw new Error("Unable to find IP address");
    }
  }

  console.log("Using IP address: ", ipAddress);
  return ipAddress;
}

function checkBoot2DockerIp() {
  return execSync("if [ ! -z $(which boot2docker) ]; then boot2docker ip | tr -d '\\n'; fi", { encoding: "UTF-8" });
}

module.exports = {
  getIp : getIp
};
