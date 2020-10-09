const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = 3000;

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//body-parse middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    //res.send('hello!');
    res.render('layouts/main');
});

app.post('/send', (req, res) => {
    console.log('body: ', req.body);
    const output = ` 
            <p> You have a new contact request </p>
              <h3>Contact details: </h3>
              <ul>
                <li> to: ${req.body.to}</li>
                <li> cc: ${req.body.cc}</li>
                <li> subject: ${req.body.subject}</li>
              </ul>
              <h3>Message: </h3>
              <p>  ${req.body.comments} </p>
    `;

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
            user: 'aeb8f199a68bfc',
            pass: 'c1bffe28b9485e'
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '&quot;NodeMailer Contact ?&quot; <nodemailerFrom@test.com>', // sender address
        to: `${req.body.to}, ${req.body.cc},dkalakuri@frbnp3.com`, // list of receivers
        subject: 'Nodemailer Test ✔', // Subject line
        text: 'Hello world ?', // plaintext body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        res.render('layouts/main', { msg: 'email has been sent successfully!!' });
    });
});



app.listen(port, () => console.log(`server started on http://localhost:${port}`));

