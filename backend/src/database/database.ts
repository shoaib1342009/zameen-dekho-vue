import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

sqlite3.verbose();

class Database {
  private db!: sqlite3.Database;
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'zameen_dekho.db');
    this.db = new sqlite3.Database(dbPath, (err: any) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database.');
        this.initialized = true;
        this.initializeTables();
      }
    });
  }

  private async waitForConnection(): Promise<void> {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (this.initialized) {
          resolve();
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  private async initializeTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        isVerified INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        beds INTEGER NOT NULL,
        baths INTEGER NOT NULL,
        sqft INTEGER NOT NULL,
        image TEXT NOT NULL,
        images TEXT,
        label TEXT NOT NULL,
        tag TEXT NOT NULL,
        address TEXT NOT NULL,
        builder TEXT NOT NULL,
        description TEXT NOT NULL,
        amenities TEXT,
        videoUrl TEXT,
        latitude REAL,
        longitude REAL,
        userId TEXT,
        isLiked INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS wishlists (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        propertyId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (propertyId) REFERENCES properties (id),
        UNIQUE(userId, propertyId)
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location)`,
      `CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type)`,
      `CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price)`,
      `CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(userId)`
    ];

    for (const table of tables) {
      await this.run(table);
    }

    // Insert initial properties if table is empty
    await this.insertInitialData();
  }

  private async insertInitialData() {
    const count = await this.get('SELECT COUNT(*) as count FROM properties') as { count: number };
    if (count.count === 0) {
      const initialProperties = [
        {
          title: "Luxurious 3BHK in Andheri West",
          price: "25000000",
          location: "Andheri West",
          type: "Apartment/Flat",
          beds: 3,
          baths: 2,
          sqft: 1200,
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
          images: JSON.stringify(["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"]),
          label: "For Sale",
          tag: "Premium",
          address: "Andheri West, Mumbai, Maharashtra",
          builder: "Lodha Developers",
          description: "Premium 3BHK apartment with modern amenities",
          amenities: JSON.stringify(["Swimming Pool", "Gym", "Parking"]),
          latitude: 19.1335,
          longitude: 72.8262
        },
        {
          title: "Affordable 2BHK in Panvel",
          price: "8500000",
          location: "Panvel",
          type: "Apartment/Flat",
          beds: 2,
          baths: 2,
          sqft: 950,
          image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
          images: JSON.stringify(["https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop"]),
          label: "For Sale",
          tag: "Value",
          address: "Panvel, Navi Mumbai, Maharashtra",
          builder: "Tata Housing",
          description: "Well-planned 2BHK with great connectivity",
          amenities: JSON.stringify(["Parking", "Security", "Garden"]),
          latitude: 18.9894,
          longitude: 73.1102
        },
        {
          title: "Modern 3BHK in Ulwe",
          price: "12000000",
          location: "Ulwe",
          type: "Apartment/Flat",
          beds: 3,
          baths: 3,
          sqft: 1100,
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
          images: JSON.stringify(["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"]),
          label: "For Sale",
          tag: "New",
          address: "Ulwe, Navi Mumbai, Maharashtra",
          builder: "Godrej Properties",
          description: "Contemporary living in upcoming area",
          amenities: JSON.stringify(["Gym", "Swimming Pool", "Club House"]),
          latitude: 18.8966,
          longitude: 73.1091
        },
        {
          title: "Sea View 4BHK in Colaba",
          price: "45000000",
          location: "Colaba",
          type: "Apartment/Flat",
          beds: 4,
          baths: 4,
          sqft: 1800,
          image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
          images: JSON.stringify(["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"]),
          label: "For Sale",
          tag: "Luxury",
          address: "Colaba, Mumbai, Maharashtra",
          builder: "Oberoi Realty",
          description: "Premium sea-facing apartment in South Mumbai",
          amenities: JSON.stringify(["Sea View", "Concierge", "Valet Parking"]),
          latitude: 18.9067,
          longitude: 72.8147
        }
      ];

      for (const property of initialProperties) {
        await this.run(
          `INSERT INTO properties (title, price, location, type, beds, baths, sqft, image, images, label, tag, address, builder, description, amenities, latitude, longitude) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          property.title, property.price, property.location, property.type,
          property.beds, property.baths, property.sqft, property.image,
          property.images, property.label, property.tag, property.address,
          property.builder, property.description, property.amenities,
          property.latitude, property.longitude
        );
      }
      console.log('Initial properties inserted.');
    }
  }

  public async get(sql: string, ...params: any[]): Promise<any> {
    await this.waitForConnection();
    return promisify(this.db.get.bind(this.db))(sql, ...params);
  }

  public async run(sql: string, ...params: any[]): Promise<any> {
    await this.waitForConnection();
    return promisify(this.db.run.bind(this.db))(sql, ...params);
  }

  public async all(sql: string, ...params: any[]): Promise<any> {
    await this.waitForConnection();
    return promisify(this.db.all.bind(this.db))(sql, ...params);
  }

  public close() {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default new Database();