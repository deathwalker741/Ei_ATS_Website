# Database Credentials - EXACT PHP System Match

## 🔍 **SOURCE VERIFICATION**

The database credentials used in the Next.js system are **EXACTLY the same** as the PHP system uses for `CONNECTION=2`.

### **PHP Source Files Verified:**
1. **`ats/asset_talent_search/ATSReportGeneration/otherfiles/hsdbconnect.cls.php`** (lines 39-44)
2. **`ats/dataGenerationAPI/application/config/database.php`** (lines 77-80)
3. **`ats/dataGenerationAPI/newEIWebsite/application/config/database.php`** (lines 79-81)

### **PHP Code Reference:**
```php
elseif ($connlocation == 2) {
    $host = "172.16.12.157";
    $user = "assetd";
    $pass = "assetd123";
    $database = $databasename; // Default: 'educatio_educat'
    $this->connid = mysql_connect($host,$user,$pass,true) or die("Can't Connect To MySQL Server");
    mysql_select_db($database,$this->connid);
}
```

---

## 🗄️ **EXACT CREDENTIALS USED**

| Parameter | PHP Value | Next.js Value | Status |
|-----------|-----------|---------------|---------|
| **Host** | `172.16.12.157` | `172.16.12.157` | ✅ Exact Match |
| **User** | `assetd` | `assetd` | ✅ Exact Match |
| **Password** | `assetd123` | `assetd123` | ✅ Exact Match |
| **Database** | `educatio_educat` | `educatio_educat` | ✅ Exact Match |

---

## 🔧 **CONNECTION CONSTANT**

PHP uses: `define("CONNECTION",2);` in `constants.php` line 9
This maps to **CONNECTION=2** case in `hsdbconnect.cls.php`

---

## 🎯 **IMPLEMENTATION**

### **Hard-coded in Database Class:**
```typescript
// lib/database.ts
this.connection = await mysql.createConnection({
  host: '172.16.12.157',           // Same as PHP $host = "172.16.12.157"
  user: 'assetd',                  // Same as PHP $user = "assetd"
  password: 'assetd123',           // Same as PHP $pass = "assetd123"
  database: 'educatio_educat',     // Same as PHP default database
  timezone: '+00:00',              // Same as PHP
  charset: 'utf8mb4',
});
```

### **Also Available via Environment Variables:**
```bash
DB_HOST=172.16.12.157
DB_USER=assetd
DB_PASSWORD=assetd123
DB_DATABASE=educatio_educat
```

---

## ✅ **VERIFICATION COMPLETE**

The Next.js system now uses the **EXACT same database credentials** as the PHP system. Both systems will:
- Connect to the same MySQL server (`172.16.12.157`)
- Use the same database user (`assetd`)
- Access the same database (`educatio_educat`)
- Work with identical table structures and data

**No database migration or data conversion needed** - both systems use the same database instance.