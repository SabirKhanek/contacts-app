const mongoose = require('./dbhandler');
const debug = require('debug')('app:db');
const _ = require('lodash')
const sharp = require('sharp')
const fs = require('fs')


const contactDbSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    profilePic: Buffer
})

const Contact = mongoose.model('Contacts', contactDbSchema)

async function getContacts() {
    const contactsInDb = await Contact.find()
    const contacts = contactsInDb.map(contact => {
        return {
            id: contact._id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            profilePic: contact.profilePic
        }
    })
    return contacts
}

async function getContact(id) {
    const contactInDb = await Contact.findById(id)
    if (contactInDb === null) return null
    const contact = {
        id: contactInDb._id,
        firstName: contactInDb.firstName,
        lastName: contactInDb.lastName,
        email: contactInDb.email,
        phone: contactInDb.phone,
        profilePic: contactInDb.profilePic
    }
    return contact
}

async function createContact(contact) {
    const newContact = new Contact(_(contact).pick(['firstName', 'lastName', 'email', 'phone', 'profilePic']).value())
    const result = await newContact.save()
    return result
}

async function deleteContact(id) {
    const result = await Contact.findByIdAndDelete(id)
    if (result === null) throw new Error('Contact not found')
    return result
}

async function updateContact(id, contact) {
    const contactInDb = await Contact.findById(id)
    if (contactInDb === null) throw new Error
        ('Contact not found')
    contactInDb.set(_(contact).pick(['firstName', 'lastName', 'email', 'phone', 'profilePic']).value())
    const result = await contactInDb.save()
    return result
}

async function resizedImageBuffer(sourceImageBuffer, dimension = 500) {
    try {
        return await sharp(sourceImageBuffer).resize(dimension, dimension).toFormat('jpeg').toBuffer()
    } catch (err) {
        debug('Error while resizing image: ' + err.message)
        throw new Error('Error while resizing image: ' + err.message)
    }
}

async function getImageBuffer(image, dirPath = '') {
    try {
        if (!fs.existsSync(dirPath + image)) return await resizedImageBuffer(fs.readFileSync('./db/dummy_pfps/jpegs/' + 'not_found.jpeg'))
        else return await resizedImageBuffer(fs.readFileSync(dirPath + image))
    } catch (err) {
        debug('Error while reading image: ' + err.message)
        throw new Error('Error while reading image: ' + err.message)
    }
}

async function fillDummyData() {
    const jpegsPath = './db/dummy_pfps/jpegs/'
    let contacts = []
    try {
        contacts = [
            {
                firstName: "Abdul Raffay",
                lastName: "Khan",
                email: "abdulraffay@mail.com",
                phone: "0300-0000000",
                profilePic: await getImageBuffer("abdulraffay.jpeg", jpegsPath),
            }, {
                firstName: "Sabir",
                lastName: "Khan",
                email: "sabirkhanek66@gmail.com",
                phone: "0300-0000000",
                profilePic: await getImageBuffer("sabirkhan.jpeg", jpegsPath),
            }, {
                firstName: "Jeff",
                lastName: "Bezos",
                email: "jeffbezos@amazon.com",
                phone: "+1 (367) 000-0000",
                profilePic: await getImageBuffer("jeffbezos.jpeg", jpegsPath),
            }, {
                firstName: "Elon",
                lastName: "Musk",
                email: "elonmusk@tesla.com",
                phone: "+1 (303) 000-0000",
                profilePic: await getImageBuffer("elonmusk.jpeg", jpegsPath),
            }, {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@anymail.com",
                phone: "+1 (000) 000-0000",
                profilePic: await getImageBuffer("john.jpeg", jpegsPath)
            }, {
                firstName: "Imran",
                lastName: "Khan",
                email: "imrankhan@pti.com",
                phone: "0304-6767654",
                profilePic: await getImageBuffer("imrankhan.jpeg", jpegsPath),
            }, {
                firstName: "Charlie",
                lastName: "Puth",
                email: "charlieputh@wedonttalkanymore.com",
                phone: "+1 (000) 000-0000",
                profilePic: await getImageBuffer("charlie.jpeg", jpegsPath)
            }
        ]
    } catch (err) {
        debug('Error in dummy data: ' + err.message)
        throw new Error('Error in dummy data: ' + err.message)
    }
    try {
        const contactsInDbToDelete = await Contact.deleteMany()
        debug('Previous data deleted')

        const contactsInDb = contacts.map((contact) => {
            return new Contact(_(contact).pick(['firstName', 'lastName', 'email', 'phone', 'profilePic']).value())
        })
        const result = await Contact.insertMany(contactsInDb)
        debug('Dummy data inserted')
        return result
    } catch (err) {
        debug('Error in db transaction: ' + err.message)
        throw new Error('Error in db transaction: ' + err.message)
    }

}

// fillDummyData()

// getContacts().then((result) => {
//     const image = result[6].profilePic
//     console.log(result[6].firstName)
//     const http = require('http');
//     const server = http.createServer(function (req, res) {
//         res.writeHead(200, { 'Content-Type': 'image/jpeg' });
//         res.end(image);
//     });
//     server.listen(8000, function () {
//         console.log('Server is listening on port 8000');
//     });
// })

module.exports = { updateContact, deleteContact, createContact, getContact, getContacts, fillDummyData }

// const contact = {
//     firstName: "Abdul Raffay",
//     lastName: "Khan",
//     email: "sabirkhanek66@gmail.com",
//     phone: "0300-0000000",
//     profilePic: "abdulraffaykhan.jpg"
// }

// createContact(contact).then((result) => {
//     console.log(result)
// })

// updateContact('641db933f00154df858f004c', { firstName: 'Sabir' })