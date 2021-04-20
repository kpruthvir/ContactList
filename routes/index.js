var express = require('express');
var router = express.Router();
var db = require('../config/db')

router.post('/submit', (req,res) => {
    console.log(req.body.search);
    let sqlname = `INSERT INTO contact values (null, '${req.body.Fname}', '${ req.body.Mname}', '${ req.body.Lname }');`;
    db.query(sqlname, (err, result) => {
        if(err) console.log(err);
        console.log(result);
    });
    var cid;
    let sql = `select Contact_id from contact where Fname='${req.body.Fname}' and Mname='${req.body.Mname}' and Lname='${req.body.Lname}';`; 
    db.query(sql, (err,result) => {
        if(err) console.log(err);
        cid = result[0].Contact_id;
        //console.log("cid is"+cid)
    
     // get the contact_id and insert address, phone, date
        let sqlrem = `INSERT INTO address values (null, ${cid}, '${ req.body.Address_type }', '${ req.body.Address }', '${ req.body.City }', '${ req.body.State }', '${ req.body.Zip }') ; INSERT INTO phone values (null, ${cid}, '${ req.body.Phone_type }', '${ req.body.Area_code }', '${ req.body.Number }' ); INSERT INTO date values (null, ${cid}, '${ req.body.Date_type }', '${ req.body.Date }');`;
        
        db.query(sqlrem, (err,result) => {
            if(err) console.log(err);
            console.log(result);
            res.render('index', { title: 'Data saved', message: 'Data saved successfully' })
        })
    })
});

// TODO err undefined length
// search for any combination of components of Name, ADdress,  Phone
router.post('/search', (req,res) => {
    console.log(req.body);
    var str = req.body.search;
    var searchArr = str.split(/[ ,]+/).filter(Boolean);
    console.log("seacrh attr is: "+req.body.search+" search arr is: "+searchArr);

    if(searchArr.length == 0)
        res.render('index', {title:"search resuts", message:"No results found with search criteria"})
    
    let resultArr = [[]];
    let commonResult;
    for( let count = 0; count < searchArr.length; count++) 
    {
        // let sql = "select * from contact,address,phone where contact.Contact_id=phone.Contact_id AND contact.Contact_id=address.Contact_id OR (contact.Fname LIKE '%"+ req.body.search +"%') OR (contact.Mname LIKE '%"+ req.body.search +"%') OR (contact.Lname LIKE '%"+ req.body.search +"%') OR (address.Address LIKE '%"+ req.body.search +"%') OR (address.City LIKE '%"+ req.body.search +"%') OR (address.State LIKE '%"+ req.body.search +"%') OR (address.Zip LIKE '%"+ req.body.search +"%')OR (phone.Area_code LIKE '%"+ req.body.search +"%') OR (phone.Number LIKE '%"+ req.body.search +"%') ";
        let sql = "SELECT contact.Contact_id,Fname,Mname,Lname,Address,City,State,Zip,Area_code,Number FROM contact LEFT JOIN address ON contact.Contact_id=address.Contact_id LEFT JOIN phone ON phone.Contact_id=address.Contact_id WHERE  Fname LIKE '%"+ searchArr[count] +"%' OR Mname LIKE '%"+ searchArr[count] + "%' OR Lname LIKE '%"+ searchArr[count] +"%' OR Address LIKE '%"+ searchArr[count] +"%' OR City LIKE '%"+ searchArr[count] +"%' OR State LIKE '%"+ searchArr[count] +"%' OR Zip LIKE '%"+ searchArr[count] +"%' OR Area_code LIKE '%"+ searchArr[count] +"%' OR Number LIKE '%"+ searchArr[count] +"%' order by contact.Contact_id";
        console.log('sql search statement', sql)
        db.query(sql, (err, rows, fields) => {
            if(err) console.log(err);
            
            // extract the contact ids from search result of  searchArr[count] string
            resultArr[count]=[];
            console.log('rows', rows)
            for (let i= 0; i < rows.length; i++) {
                //         const element = req.body.Phone_id[i];
                resultArr[count][i] = rows[i].Contact_id;
            }
            console.log("result arr at count:"+count+"is : "+resultArr[count])
            if(count === searchArr.length-1)    //last iteration or searchString
            {
                commonResult = resultArr.reduce((prev,curr) => prev.filter(el => curr.includes(el)));
                console.log("after comparing all arrays common elements are: "+ JSON.stringify(commonResult))
                //res.send(commonResult);
                
                console.log("cr is:"+commonResult+" cr length is:"+commonResult.length+" cr is array:"+commonResult.isArray+" is cr null: "+(commonResult ===null))
                //console.log("result arr after f block count:is : "+commonResult+"blank")
                if(commonResult.length !== 0)
                {
                    let sqlFinal = `SELECT contact.Contact_id,Fname,Mname,Lname FROM contact WHERE contact_id IN (${commonResult})`;
                    db.query(sqlFinal, (err, rows, fields) =>{
                        if(err) console.log(err)
                        else
                            res.render('search', {title: ' Search results', items: rows})
                    })
                }
                
                else if (commonResult.length === 0)
                    res.render('index', {title:"search resuts", message:"No results found with search criteria"})
                else
                    throw err
            }
        })
        
    }
    
});


router.get('/', (req,res) => {
    
    res.render('index')
    //  res.sendFile('../views/index.html', {root: __dirname})
});

module.exports = router