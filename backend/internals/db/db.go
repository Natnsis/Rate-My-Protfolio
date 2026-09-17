package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Connect opens the Neon/Postgres database at the given DSN, runs
// migrations, and seeds demo data on a fresh database so the app never
// feels empty.
func Connect(dsn string) (*gorm.DB, error) {
	gormDB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, err
	}

	if err := gormDB.AutoMigrate(
		&User{},
		&Portfolio{},
		&Version{},
		&Like{},
		&Comment{},
		&Roast{},
		&Notification{},
	); err != nil {
		return nil, err
	}

	var userCount int64
	gormDB.Model(&User{}).Count(&userCount)
	if userCount == 0 {
		log.Println("[db] empty database detected — seeding demo data")
		if err := Seed(gormDB); err != nil {
			log.Printf("[db] seed failed: %v", err)
		}
	}

	markDemoPortfolios(gormDB)

	return gormDB, nil
}

// markDemoPortfolios flags portfolios created by the demo seed as sample data,
// so databases seeded before the Demo column existed are labelled too.
func markDemoPortfolios(gdb *gorm.DB) {
	gdb.Model(&Portfolio{}).Where("demo = ? AND title IN ?", false, demoPortfolioTitles).Update("demo", true)
}
