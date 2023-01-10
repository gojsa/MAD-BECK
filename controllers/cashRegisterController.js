const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const cashRegister = db.cashRegister;
const cashRegisterCommand = db.cashRegisterCommand;
const Company = db.companies;
const Invoice = db.invoice
const InvoiceArticle = db.invoiceArticle
const StorageMovement = db.storageMovement
const StorageStatus = db.storageStatus

const request = require('request');

const generateInvoice = asyncHandler(async (req, res) => {

    const {
        invoice_id
    } = req.params

    const {
        command
    } = req.body

    const findInvoice = await Invoice.findOne({
        where: {
            invoice_id
        }
    })

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    const articles = await findInvoice.getInvoice_articles({
        where: {
            valid: 'Y'
        }
    })

    if (!articles || articles.length === 0) {
        res.status(404)
        throw new Error("This invoice has no articles!")
    }

    let str = ""
    let paymentsStr = ""
    let bodyFormat

    const methods = await findInvoice.getMethod_of_payments()

    if (!methods) {
        res.status(404)
        throw new Error("Invoice does not have any payment methods!")
    }

    for (let i = 0; i < methods.length; i++) {
        paymentsStr += 
    `<VrstaPlacanja>
        <Oznaka>${methods[i].name}</Oznaka>
        <Iznos>${methods[i].invoice_method_of_payment.total}</Iznos>
    </VrstaPlacanja>`
    }

    if (command === "SFR") {

        if (findInvoice.invoice_type.toUpperCase() === "MALOPRODAJA") {

            for (let i = 0; i < articles.length; i++) {
                str += `<RacunStavka>
                <artikal>
                <Sifra>${articles[i].article_id}</Sifra>
                <Naziv>${articles[i].article_name}</Naziv>
                <JM>${articles[i].unit_of_measure}</JM>
                <Cijena>${articles[i].value_with_vat}</Cijena>
                <Stopa>E</Stopa>
                <Grupa>0</Grupa>
                <PLU>0</PLU>
                </artikal>
                <Kolicina>${articles[i].amount}</Kolicina>
                <Rabat>${articles[i].discount}</Rabat>
                </RacunStavka>`
            }

            bodyFormat = `<?xml version="1.0" encoding="utf-8"?>
            <RacunZahtjev xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
              <VrstaZahtjeva>0</VrstaZahtjeva>
              <NoviObjekat>  
                <StavkeRacuna>     
                  ` + str + `
                </StavkeRacuna>
                <VrstePlacanja>` + paymentsStr + `
            </VrstePlacanja>
              </NoviObjekat>
            </RacunZahtjev>`
        } else if (findInvoice.invoice_type.toUpperCase() === "VELEPRODAJA") {
            for (let i = 0; i < articles.length; i++) {
                str += `<RacunStavka>
                <artikal>
                <Sifra>${articles[i].article_id}</Sifra>
                <Naziv>${articles[i].article_name}</Naziv>
                <JM>${articles[i].unit_of_measure}</JM>
                <Cijena>${articles[i].selling_price}</Cijena>
                <Stopa>E</Stopa>
                </artikal>
                <Kolicina>${articles[i].amount}</Kolicina>
                <Rabat>${articles[i].discount}</Rabat>
                </RacunStavka>`
            }

            bodyFormat = `<?xml version="1.0" encoding="utf-8"?>
            <RacunZahtjev xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <BrojZahtjeva>233</BrojZahtjeva>
            <VrstaZahtjeva>0</VrstaZahtjeva>
            <NoviObjekat><Datum>0001-01-01T00:00:00</Datum>
            <Kupac>
                <IDbroj>4209694660003</IDbroj>
                <Naziv>Tring d.o.o.</Naziv>
                <Adresa>Lejlekuša bb</Adresa>
                <PostanskiBroj>75320</PostanskiBroj>
                <Grad>Gracanica</Grad>
            </Kupac>
            <StavkeRacuna>` + str + `
            </StavkeRacuna>
            <VrstePlacanja>` + paymentsStr + `
        </VrstePlacanja>
            <BrojRacuna></BrojRacuna>
            <Napomena>Hvala na posjeti!!!
            Operater: Niko Neznanović</Napomena>
            </NoviObjekat></RacunZahtjev>`
        } else {
            res.status(400)
            throw new Error("Invalid invoice type!")
        }

    } else if (command === "SRR") {

        // if (isNan(findInvoice.fiscal_number)) {
        //     res.status(400)
        //     throw new Error("Invalid fiscal number!")
        // }

        if (findInvoice.invoice_type.toUpperCase() === "MALOPRODAJA") {

            for (let i = 0; i < articles.length; i++) {
                str += `<RacunStavka>
            <artikal>
            <Sifra>${articles[i].article_id}</Sifra>
            <Naziv>${articles[i].article_name}</Naziv>
            <JM>${articles[i].unit_of_measure}</JM>
            <Cijena>${articles[i].value_with_vat}</Cijena>
            <Stopa>E</Stopa>
            <Grupa>0</Grupa>
            <PLU>0</PLU>
            </artikal>
            <Kolicina>${articles[i].amount}</Kolicina>
            <Rabat>${articles[i].discount}</Rabat>
            </RacunStavka>`
            }

            bodyFormat = `<?xml version="1.0" encoding="utf-8"?>
            <RacunZahtjev xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
              <VrstaZahtjeva>0</VrstaZahtjeva>
              <NoviObjekat>  
                <StavkeRacuna>     
                  ` + str + `
                </StavkeRacuna>
                <VrstePlacanja>
                ` + paymentsStr + `
            </VrstePlacanja>
                <BrojRacuna>${findInvoice.fiscal_number}</BrojRacuna>
              </NoviObjekat>
            </RacunZahtjev>`
        } else if (findInvoice.invoice_type.toUpperCase() === "VELEPRODAJA") {
            for (let i = 0; i < articles.length; i++) {
                str += `<RacunStavka>
            <artikal>
            <Sifra>${articles[i].article_id}</Sifra>
            <Naziv>${articles[i].article_name}</Naziv>
            <JM>${articles[i].unit_of_measure}</JM>
            <Cijena>${articles[i].selling_price}</Cijena>
            <Stopa>E</Stopa>
            </artikal>
            <Kolicina>${articles[i].amount}</Kolicina>
            <Rabat>${articles[i].discount}</Rabat>
            </RacunStavka>`
            }

            bodyFormat = `<?xml version="1.0" encoding="utf-8"?>
            <RacunZahtjev xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                <BrojZahtjeva>35</BrojZahtjeva>
                <VrstaZahtjeva>2</VrstaZahtjeva>
                <NoviObjekat>
                    <Datum>0001-01-01T00:00:00</Datum>
                    <Kupac>
                    </Kupac>
                    <StavkeRacuna>   
                  ` + str + `
                </StavkeRacuna>
                <VrstePlacanja>`+ paymentsStr +`
            </VrstePlacanja>
            <BrojRacuna>${findInvoice.fiscal_number}</BrojRacuna>
        </NoviObjekat>
    </RacunZahtjev>`
        }

        // <IDbroj>4209694660003</IDbroj>
        // <Naziv>Tring d.o.o.</Naziv>
        // <Adresa>Mehmeda Vehbi ef. Semsekadica bb</Adresa>
        // <PostanskiBroj>75320</PostanskiBroj>
        // <Grad>Gracanica</Grad>

    } else {
        res.status(400)
        throw new Error("Invalid command type!")
    }

    if (command === "SFR") {

        if (!req.query.total_invoice) {
            res.status(400)
            throw new Error("Please provide the total price of your invoice!")
        } else {

            request({
                url: `${process.env.FISCAL_IP}/${command}`,
                method: 'POST',
                body: bodyFormat
            }, async function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    const lines = body.split('\n')

                    const line = lines[5]
                
                    const value = line.substring(line.indexOf('>') + 1, line.lastIndexOf('<'))
                
                    const updateInvoice = await Invoice.update({
                        fiscal_number: parseInt(value),
                        fiscal_status: "Y",
                        isLocked: "Y",
                        status: "plaćeno",
                        total_invoice: parseInt(req.query.total_invoice)
                    }, {
                        where: {
                            invoice_id: findInvoice.invoice_id
                        }
                    })

                    for (let i = 0; i < articles.length; i++) {
                        console.log("INVOICE")
                        const findSecondInvoice = await Invoice.findOne({where: {invoice_id}})
                        console.log(findSecondInvoice)
                        console.log("STORAGE MOVEMENT")
                        const findStorageMovement = await StorageMovement.findOne({where: {storage_movement_id: articles[i].storage_movement_id}})
                        console.log(findStorageMovement)
                        await StorageMovement.update({type_of_movement: "FISCALIZED", description: findSecondInvoice.fiscal_number.toString()}, {where: {storage_movement_id: findStorageMovement.storage_movement_id}})

                        const findStorageStatus = await StorageStatus.findOne({where: {storage_id: findStorageMovement.storage_id, article_id: findStorageMovement.article_id}})

                        await StorageStatus.update({saldo: findStorageStatus.saldo - parseInt(articles[i].amount)}, {where: {storage_status_id: findStorageStatus.storage_status_id}})
                    }
                
                    if (!updateInvoice) {
                        res.status(200).json({
                            message: "Fiscalization was successful but fiscal number update was not!",
                            body
                        })
                    } else {

                        res.status(200).json({
                            message: "Fiscalization was successful!",
                            body
                        })
                    }
        
                } else {
                    res.status(500).send("An error occured!")
                }
            });
        }
    } else {
        request({
            url: `${process.env.FISCAL_IP}/${command}`,
            method: 'POST',
            body: bodyFormat
        }, async function (error, response, body) {
            if (!error && response.statusCode == 200) {

                res.status(200).json({message: "Storn was successful!", body})

            } else {

                res.status(500).send("An error occured!")
            }
        });
    }

})

const getCommands = asyncHandler(async (req, res) => {

    const {
        companyId
    } = req.params

    const findCompany = await Company.findOne({
        where: {
            companies_id: companyId
        }
    })

    if (!findCompany) {
        res.status(404)
        throw new Error("Company was not found!")
    }

    const cashRegisters = await findCompany.getCash_registers()

    let commands = []

    for (let i = 0; i < cashRegisters.length; i++) {
        commands.push(await cashRegisters[i].getCash_register_commands())
    }

    if (!commands || commands.length === 0) {
        res.status(404)
        throw new Error("There were no commands found!")
    }

    res.status(200).json(...commands)

})

const period = asyncHandler(async (req, res) => {

    const {
        dateFrom,
        dateTo
    } = req.body

    const formatFrom = dateFrom.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const formatTo = dateTo.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const str = `<?xml version="1.0" encoding="utf-8"?>
    <Zahtjev xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <Parametri>
            <Parametar>
                <Naziv>odDatuma</Naziv>
                <Vrijednost>${formatFrom}</Vrijednost>
            </Parametar>
            <Parametar>
                <Naziv>doDatuma</Naziv>
                <Vrijednost>${formatTo}</Vrijednost>
            </Parametar>
        </Parametri>
    </Zahtjev>`

    request({
        url: `${process.env.FISCAL_IP}/SPS`,
        method: 'POST',
        body: str
    }, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
            res.status(200).send(body)
        } else {
            console.log(body)
            res.status(500).json({message: "An error occured!"})
        }
    });
})

const periodReport = asyncHandler(async (req, res) => {

    const {
        dateFrom,
        dateTo
    } = req.body

    const formatFrom = dateFrom.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const formatTo = dateTo.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const str = `<?xml version="1.0" encoding="utf-8"?><Zahtjev xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><BrojZahtjeva>695503</BrojZahtjeva><VrstaZahtjeva>5</VrstaZahtjeva><Parametri><Parametar><Naziv>odDatuma</Naziv><Vrijednost>${formatFrom}</Vrijednost></Parametar><Parametar><Naziv>doDatuma</Naziv><Vrijednost>${formatTo}</Vrijednost></Parametar></Parametri></Zahtjev>`


    request({
        url: `${process.env.FISCAL_IP}/SPI`,
        method: 'POST',
        body: str
    }, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
            res.status(200).send(body)
        } else {
            console.log(body)
            res.status(500).json({message: "An error occured!"})
        }
    });
})

const end = asyncHandler(async (req, res) => {
    const str = `<?xml version="1.0" encoding="utf-8"?><Zahtjev xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><BrojZahtjeva>61529</BrojZahtjeva><VrstaZahtjeva>4</VrstaZahtjeva><Parametri /></Zahtjev>`

    request({
        url: `${process.env.FISCAL_IP}/SDI`,
        method: 'POST',
        body: str
    }, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
            res.status(200).send(body)
        } else {
            console.log(body)
            res.status(500).json({message: "An error occured!"})
        }
    });
})

const duplicate = asyncHandler(async (req, res) => {

    const { command, number } = req.body

    if (command === "SFR") {

        const str = `<?xml version="1.0" encoding="UTF-8"?>

        <Zahtjev xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        
        <BrojZahtjeva>43950</BrojZahtjeva>
        
        <VrstaZahtjeva>3</VrstaZahtjeva>
        
        
        <Parametri>
        
        
        <Parametar>
        
        <Naziv>BrojRacuna</Naziv>
        
        <Vrijednost>${number}</Vrijednost>
        
        </Parametar>
        
        </Parametri>
        
        </Zahtjev>`
    
        request({
            url: `${process.env.FISCAL_IP}/SDFR`,
            method: 'POST',
            body: str
        }, async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                res.status(200).send(body)
            } else {
                console.log(body)
                res.status(500).json({message: "An error occured!"})
            }
        });
    } else if (command === "SRR") {

        const str = `<?xml version="1.0" encoding="UTF-8"?>

        <Zahtjev xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        
        <BrojZahtjeva>43950</BrojZahtjeva>
        
        <VrstaZahtjeva>3</VrstaZahtjeva>
        
        
        <Parametri>
        
        
        <Parametar>
        
        <Naziv>BrojRacuna</Naziv>
        
        <Vrijednost>${number}</Vrijednost>
        
        </Parametar>
        
        </Parametri>
        
        </Zahtjev>`
    
        request({
            url: `${process.env.FISCAL_IP}/SDRR`,
            method: 'POST',
            body: str
        }, async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                res.status(200).send(body)
            } else {
                console.log(body)
                res.status(500).json({message: "An error occured!"})
            }
        });
    } else {
        res.status(400)
        throw new Error("Invalid command!")
    }

})

const checkStorageStatus = asyncHandler(async(req, res) => {

    const { invoice_id } = req.params

    const findInvoice = await Invoice.findOne({
        where: {
            invoice_id
        }
    })

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    const articles = await findInvoice.getInvoice_articles({
        where: {
            valid: 'Y'
        }
    })

    let condition = "OK"
    let id

    for (let i = 0; i < articles.length; i++) {

        const findStorageStatus = await StorageStatus.findOne({where: {storage_id: articles[i].storage_id, article_id: articles[i].article_id}})

        if (!findStorageStatus) {
            condition = "STORAGE_STATUS_NOT_FOUND"
            break
        }

        if (articles[i].amount < findStorageStatus.saldo) {
            condition = "SALDO"
            id = articles[i].invoice_id
            break
        }
    }

    switch (condition){
        case "OK":
            res.status(200).json({message: "OK"})
            break
        case "SALDO":
            res.status(200).json({message: "Not enough in storage!", id})
            break
        case "STORAGE_STATUS_NOT_FOUND":
            res.status(200).json({message: ""})
            break
    }
})

module.exports = {
    generateInvoice,
    getCommands,
    period,
    periodReport,
    end,
    duplicate,
    checkStorageStatus
}