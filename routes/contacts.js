const express = require('express');
const { getContacts, createContact, getContact, fillDummyData, deleteContact } = require('../db/contacts');
const router = express.Router();
const { forEach } = require('p-iteration')
const _ = require('lodash');

router.get('/', async (req, res) => {
    if (req.body.id) {
        const contact = await getContact(req.body.id)
        if (contact === null) return res.status(404).send('Contact not found')
        else res.status(200).send(contact)
    } else {
        const contacts = await getContacts()
        res.status(200).send(contacts)
    }
})

router.post('/', async (req, res) => {
    const contact = req.body
    const result = await createContact(contact)
    res.status(200).send(result)
})

router.delete('/', async (req, res) => {
    const contacts = req.body
    const result = []
    await forEach(contacts, async contact => {
        try {
            const dbDeleteResult = await deleteContact(contact)
            result.push({ id: contact, result: dbDeleteResult })
        } catch (err) {
            result.push({ id: contact, error: err.message })
        }
    });

    res.status(200).send(result)
})

router.post('/filldummy', async (req, res) => {
    try {
        await fillDummyData()
        const result = await getContacts()
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

module.exports = router;