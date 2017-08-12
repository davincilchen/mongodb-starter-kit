
# mongodb-starter-kit

MongoDB 入門學習環境。

## 安裝

### 啟動 Node.js 主程式

申請 [MongoLab](https://mlab.com/) 免費資料庫，並修改 ```app.js``` 填入正確的 MongoDB URI：

```
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds019033.mlab.com:19033/vcard');
```

啟動主程式：

```
$ npm install
$ node app.js
```

### 匯入測試用資料庫

修改 ```scripts/0001-import-db.js``` 並填入正確的 MongoDB URI。匯入測試用資料庫：

```
$ mongo ds019033.mlab.com:19033/vcard scripts/0001-import-db.js scripts/0001-import-db.js
```