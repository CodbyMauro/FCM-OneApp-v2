const path = require('path');
const fs = require('fs');
const et = require('elementtree');
const { ConfigParser } = require('cordova-common');
const { Console } = require('console');

module.exports = function (context) {
    var projectRoot = context.opts.cordova.project ? context.opts.cordova.project.root : context.opts.projectRoot;
    var configXML = path.join(projectRoot, 'config.xml');
    var configParser = new ConfigParser(configXML);
    var channelName = configParser.getPlatformPreference("NotificationChannelDefaultName", "android");
    var channelDescription = configParser.getPlatformPreference("NotificationChannelDefaultDescription", "android");

    var stringsXmlPath = path.join(projectRoot, 'platforms/android/app/src/main/res/values/strings.xml');
    var stringsXmlContents = fs.readFileSync(stringsXmlPath).toString();
    var etreeStrings = et.parse(stringsXmlContents);

    var dataTags = etreeStrings.findall('./string[@name="notification_channel_name"]');
    for (var i = 0; i < dataTags.length; i++) {
        var data = dataTags[i];
        if(channelName != ""){
            console.log("1 - entrou no if")
            data.text = channelName;
        }
        else{
            console.log("1 - entrou no else")
            data.remove(data);
        }
    }

    var dataTagsSecond = etreeStrings.findall('./string[@name="notification_channel_description"]');
    for (var i = 0; i < dataTagsSecond.length; i++) {
        var data = dataTagsSecond[i];
        if(channelDescription != ""){
            console.log("2 - entrou no if")
            data.text = channelDescription;
        }
        else{
            console.log("2 - entrou no else")
            data.remove(data);
        }
    }
    
    var resultXmlStrings = etreeStrings.write();
    fs.writeFileSync(stringsXmlPath, resultXmlStrings);
};
