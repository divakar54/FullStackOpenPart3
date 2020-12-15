const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = 'mongodb+srv://new_user1:<passowrd></passowrd>@cluster0.zxqlu.mongodb.net/phonebook-app?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const entrySchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Entry = mongoose.model('Entry', entrySchema)

const entry = new Entry({
    name: name,
    number: number
})

if(process.argv.length == 5){
    entry.save().then(result => {
        console.log('entry saved!')
        mongoose.connection.close()
    })
}

if(process.argv.length == 3){
    Entry.find({}).then(result => {
        result.forEach(entry => {
            console.log(entry)
        })
        mongoose.connection.close()
    })
}