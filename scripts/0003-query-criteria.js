{
    var db = connect('localhost/vcard');

    db.users
    .find({ interests: { $in: [ 'sport' ] } })
    .forEach(function(data) {
        print(data.name);
    });
}