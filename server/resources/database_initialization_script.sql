use projectCS;
CREATE TABLE shops (
	shop_id INT NOT NULL AUTO_INCREMENT,
    shop_name VARCHAR(100) NOT NULL,
    shop_owner VARCHAR(100) NOT NULL,
    shop_speciality VARCHAR(100),
    creation_date DATE,
    PRIMARY KEY ( shop_id )
);
INSERT INTO shops ( 
	shop_name, 
    shop_owner, 
    shop_speciality 
    )
VALUES ( 
	"Lassin Tsufee",
	"Lassi", 
    "Kaneli" 
    );

INSERT INTO shops ( 
	shop_name, 
    shop_owner, 
    shop_speciality 
    )
VALUES ( 
	"Leon Kahvi",
	"Leo", 
    "Perfee" 
    );