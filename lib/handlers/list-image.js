// npm install aws-sdk --save
var aws = require('aws-sdk');
var ec2 = new aws.EC2();

const tagName = "tag-name";

exports.handler = async function (event) {

    // list all image by tag
    ec2.describeImages({
        Owners: [
            'self'
        ],
        Filters: [
            {
                Name: 'tag:' + tagName,
                Values: [
                    'yes'
                ]
            },
        ]
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            return;
        };

        for (var index in data.Images) {
            var imagename = data.Images[index].Name
            var imageid = data.Images[index].ImageId
            console.log(imageid, imagename);
        }

    });
};