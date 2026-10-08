CREATE TABLE "cuisine_cart" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cuisine_cart_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cuisine_id" smallint NOT NULL,
	"cuisine_cart_type" cuisine_cart_types NOT NULL,
	"group" varchar(25) NOT NULL,
	"name" varchar(50) NOT NULL,
	"price" smallint DEFAULT 0 NOT NULL,
	"flag" boolean DEFAULT true NOT NULL,
	"order" smallint NOT NULL
);
CREATE UNIQUE INDEX "cuisine_cart_pkey" ON "cuisine_cart" ("id");
ALTER TABLE "cuisine_cart" ADD CONSTRAINT "cuisine_cart_fk_cuisine_id" FOREIGN KEY ("cuisine_id") REFERENCES "cuisines"("id");

insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (1, 1, 'radio', 'burger type', 'Big Mac', 50, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (2, 1, 'radio', 'cheese', 'Extra', 10, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (3, 1, 'radio', 'cheese', 'Normal', 0, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (4, 1, 'radio', 'burger type', 'Normal', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (5, 1, 'radio', 'drinks', 'coca cola', 15, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (6, 1, 'radio', 'drinks', 'no drink', 0, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (7, 1, 'radio', 'drinks', 'ice tea', 10, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (8, 1, 'radio', 'drinks', 'mineral water', 5, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (9, 1, 'checkbox', 'add ons', 'french fries', 5, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (10, 1, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (11, 1, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 11);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (12, 11, 'radio', 'twigim type', 'yachae twigim', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (13, 11, 'radio', 'twigim type', 'ojingeo twigim', 20, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (14, 11, 'radio', 'twigim type', 'gochu twigim', 40, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (15, 11, 'radio', 'twigim type', 'goguma twigim', 60, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (16, 11, 'radio', 'portion', 'standard', 0, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (17, 11, 'radio', 'portion', 'large', 50, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (18, 11, 'radio', 'spicy level', 'mild', 0, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (19, 11, 'radio', 'spicy level', 'medium', 10, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (20, 11, 'radio', 'spicy level', 'hot', 20, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (21, 11, 'checkbox', 'add ons', 'french fries', 5, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (22, 11, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 11);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (23, 11, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 12);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (24, 16, 'radio', 'portion', '3 item', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (25, 16, 'radio', 'portion', '5 item', 30, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (26, 16, 'radio', 'portion', '7 item', 50, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (27, 16, 'radio', 'flavor', 'soy sauce', 0, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (28, 16, 'radio', 'flavor', 'grilled', 10, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (29, 16, 'radio', 'flavor', 'roasted', 20, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (30, 21, 'radio', 'egg quantity', 'enough', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (31, 21, 'radio', 'egg quantity', 'plenty', 30, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (32, 21, 'radio', 'beff quantity', 'enough', 0, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (33, 21, 'radio', 'beff quantity', 'plenty', 40, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (34, 21, 'radio', 'spicy level', 'normal', 0, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (35, 21, 'radio', 'spicy level', 'mild', 10, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (36, 21, 'radio', 'spicy level', 'medium', 20, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (37, 21, 'radio', 'spicy level', 'hot', 30, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (38, 21, 'radio', 'spicy level', 'hell', 40, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (39, 16, 'checkbox', 'add ons', 'french fries', 5, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (40, 16, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (41, 16, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (42, 21, 'checkbox', 'add ons', 'french fries', 5, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (43, 21, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 11);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (44, 21, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 12);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (45, 15, 'radio', 'food filling', 'pork', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (46, 15, 'radio', 'food filling', 'chicken', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (47, 15, 'radio', 'food filling', 'shrimp', 10, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (49, 15, 'radio', 'quantity', '5 item', 0, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (50, 15, 'radio', 'quantity', '7 item', 20, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (52, 15, 'checkbox', 'add ons', 'french fries', 5, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (53, 15, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (54, 15, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (55, 15, 'radio', 'food filling', 'crab', 15, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (56, 15, 'radio', 'quantity', '9 item', 40, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (57, 20, 'radio', 'egg quantity', 'enough', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (58, 20, 'radio', 'egg quantity', 'plenty', 30, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (59, 20, 'radio', 'spicy level', 'normal', 0, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (60, 20, 'radio', 'spicy level', 'mild', 10, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (61, 20, 'radio', 'spicy level', 'medium', 20, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (62, 20, 'radio', 'spicy level', 'hot', 30, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (63, 20, 'radio', 'spicy level', 'hell', 40, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (64, 20, 'checkbox', 'add ons', 'french fries', 5, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (65, 20, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (66, 20, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 11);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (67, 14, 'radio', 'texture', 'chewy', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (68, 14, 'radio', 'texture', 'crispy', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (69, 14, 'radio', 'portion', 'standard', 0, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (70, 14, 'radio', 'portion', 'large', 30, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (71, 14, 'checkbox', 'add ons', 'french fries', 5, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (72, 14, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (73, 14, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (74, 19, 'radio', 'portion', 'standard', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (75, 19, 'radio', 'portion', 'large', 40, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (76, 19, 'radio', 'spicy level', 'normal', 0, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (77, 19, 'radio', 'spicy level', 'mild', 10, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (78, 19, 'radio', 'spicy level', 'medium', 20, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (79, 19, 'radio', 'spicy level', 'hot', 30, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (80, 19, 'radio', 'spicy level', 'hell', 40, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (81, 19, 'checkbox', 'add ons', 'french fries', 5, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (82, 19, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (83, 19, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (84, 13, 'radio', 'portion', '3 item', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (85, 13, 'radio', 'portion', '5 item', 20, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (86, 13, 'radio', 'portion', '7 item', 40, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (87, 13, 'radio', 'food filling', 'pork', 0, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (88, 13, 'radio', 'food filling', 'chicken', 10, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (89, 13, 'radio', 'food filling', 'shrimp', 10, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (90, 13, 'radio', 'food filling', 'crab', 15, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (91, 13, 'checkbox', 'add ons', 'french fries', 5, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (92, 13, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (93, 13, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (94, 18, 'radio', 'texture', 'standar', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (95, 18, 'radio', 'texture', 'yamin', 5, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (96, 18, 'radio', 'texture', 'standar + meetbal', 15, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (97, 18, 'radio', 'texture', 'yamin + meetbal', 20, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (98, 18, 'checkbox', 'add ons', 'french fries', 5, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (99, 18, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (100, 18, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (101, 12, 'radio', 'types', 'Shandong Jianbing', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (102, 12, 'radio', 'types', 'Tianjin Jianbing Guozi', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (103, 12, 'radio', 'types', 'Beijing Style', 20, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (104, 12, 'radio', 'portion', '3 item', 0, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (105, 12, 'radio', 'portion', '5 item', 15, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (106, 12, 'radio', 'portion', '7 item', 30, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (107, 12, 'checkbox', 'add ons', 'french fries', 5, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (108, 12, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (109, 12, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (110, 17, 'radio', 'portion', 'standard', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (111, 17, 'radio', 'portion', 'large', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (112, 17, 'radio', 'pangsit', 'standard', 0, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (113, 17, 'radio', 'pangsit', 'extra', 5, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (114, 17, 'radio', 'noodle', 'standard', 0, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (115, 17, 'radio', 'noodle', 'extra', 10, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (116, 17, 'checkbox', 'add ons', 'french fries', 5, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (117, 17, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (118, 17, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (119, 5, 'radio', 'portion', 'standard', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (120, 5, 'radio', 'portion', 'large', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (121, 5, 'radio', 'french fries', 'standard', 0, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (122, 5, 'radio', 'french fries', 'extra', 10, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (123, 5, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (124, 5, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (125, 4, 'radio', 'sausage', 'Rindswurst', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (126, 4, 'radio', 'sausage', 'Mit Darm', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (127, 4, 'radio', 'sausage', 'Ohne Darm', 15, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (128, 4, 'radio', 'sausage', 'Vegetarian', 5, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (129, 4, 'radio', 'french fries', 'standard', 0, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (130, 4, 'radio', 'french fries', 'extra', 10, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (131, 4, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (132, 4, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (133, 3, 'radio', 'spicy level', 'normal', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (134, 3, 'radio', 'spicy level', 'mild', 10, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (135, 3, 'radio', 'spicy level', 'medium', 20, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (136, 3, 'radio', 'spicy level', 'hot', 30, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (137, 3, 'radio', 'spicy level', 'hell', 40, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (138, 3, 'radio', 'sausage', 'standard', 0, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (139, 3, 'radio', 'sausage', 'extra', 30, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (140, 3, 'checkbox', 'add ons', 'french fries', 5, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (141, 3, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (142, 3, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (143, 10, 'checkbox', 'add ons', 'french fries', 5, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (144, 10, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (145, 10, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (146, 6, 'radio', 'type', 'Chicken Shawarma', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (147, 6, 'radio', 'type', 'Beef or Lamb Shawarma', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (148, 6, 'radio', 'type', 'Mixed Shawarma', 20, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (149, 6, 'radio', 'type', 'Levantine Variations', 30, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (150, 6, 'checkbox', 'add ons', 'french fries', 5, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (151, 6, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (152, 6, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (153, 22, 'radio', 'spicy level', 'mild', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (154, 22, 'radio', 'spicy level', 'medium', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (155, 22, 'radio', 'spicy level', 'hot', 20, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (156, 22, 'checkbox', 'add ons', 'french fries', 5, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (157, 22, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (158, 22, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (159, 23, 'radio', 'satai type', 'Chicken', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (160, 23, 'radio', 'satai type', 'Beef', 20, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (161, 23, 'radio', 'satai type', 'Sheep', 15, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (162, 23, 'radio', 'satai type', 'Rabbit', 10, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (163, 23, 'radio', 'spicy level', 'mild', 0, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (164, 23, 'radio', 'spicy level', 'medium', 10, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (165, 23, 'radio', 'spicy level', 'hot', 20, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (166, 23, 'checkbox', 'add ons', 'french fries', 5, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (167, 23, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 9);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (168, 23, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 10);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (169, 9, 'radio', 'gimbap type', 'Ilban Gimbap', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (170, 9, 'radio', 'gimbap type', 'Chamchi Gimbap', 20, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (171, 9, 'radio', 'gimbap type', 'So-gogi Gimbap', 15, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (172, 9, 'radio', 'gimbap type', 'Cheese Gimbap', 10, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (173, 9, 'radio', 'gimbap type', 'Kimchi Gimbap', 10, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (174, 9, 'checkbox', 'add ons', 'french fries', 5, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (175, 9, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (176, 9, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 8);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (177, 8, 'radio', 'eomuk type', 'Flat Sheet', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (178, 8, 'radio', 'eomuk type', 'Cylindrical', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (179, 8, 'radio', 'eomuk type', 'Skewered', 20, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (180, 8, 'radio', 'eomuk type', 'Ball and Cake Bites', 25, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (181, 8, 'checkbox', 'add ons', 'french fries', 5, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (182, 8, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (183, 8, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (191, 7, 'radio', 'spicy level', 'normal', 0, true, 1);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (192, 7, 'radio', 'spicy level', 'mild', 10, true, 2);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (193, 7, 'radio', 'spicy level', 'medium', 20, true, 3);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (194, 7, 'radio', 'spicy level', 'hot', 30, true, 4);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (195, 7, 'radio', 'spicy level', 'hell', 40, true, 5);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (196, 7, 'checkbox', 'add ons', 'french fries', 5, true, 6);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (197, 7, 'checkbox', 'add ons', 'extra chili sauce sachet', 2, true, 7);
insert into "cuisine_cart" ("id", "cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (198, 7, 'checkbox', 'add ons', 'extra tomato sauce sachet', 2, true, 8);
insert into "cuisine_cart" ("cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (2, 'radio', 'drinks', 'coca cola', 15, true, 1);
insert into "cuisine_cart" ("cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (2, 'radio', 'drinks', 'no drink', 0, true, 2);
insert into "cuisine_cart" ("cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (2, 'radio', 'drinks', 'ice tea', 10, true, 3);
insert into "cuisine_cart" ("cuisine_id", "cuisine_cart_type", "group", "name", "price", "flag", "order") overriding system value values (2, 'radio', 'drinks', 'mineral water', 5, true, 4);

CREATE TYPE cuisine_type AS ENUM ('indonesian', 'western', 'korean', 'chinese');

CREATE TABLE "cuisines" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cuisines_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"cuisine" cuisine_type NOT NULL,
	"description" varchar(300) NOT NULL,
	"price" smallint NOT NULL,
	"rate" real NOT NULL,
	"review" smallint DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX "cuisines_pkey" ON "cuisines" ("id");

insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (1, 'Burger', 'western', 'A burger is a popular sandwich made of a cooked ground meat patty placed inside a sliced bread bun.', 389, 4.2, 10);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (2, 'Kebab', 'western', 'A kebab is a popular dish of roasted or grilled meat, shish kebab, and döner kebab. It comes from the Middle East and uses meats like lamb, beef, or chicken.', 330, 4.1, 31);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (3, 'Hotdog', 'western', 'A hot dog is a cooked, grilled, or steamed sausage—typically a wiener or frankfurter—served inside a partially sliced soft bread bun.', 284, 4.3, 21);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (4, 'Currywurst', 'western', 'Currywurst is a famous German fast-food dish made of pork sausage, warm curry ketchup, and yellow curry powder. Invented in Berlin in 1949 by Herta Heuwer, it is typically steamed or fried, sliced into bite-sized pieces, and served fast and hot on a paper tray with french fries or a bread roll.', 1300, 4.4, 18);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (5, 'Fish & Chips', 'western', 'Fish and chips is a classic hot meal from Britain featuring crispy deep-fried battered white fish served alongside thick-cut fried potatoes.', 12000, 4.4, 3);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (6, 'Shawarma & Gyros', 'western', 'Shawarma and gyros are popular meat sandwiches cooked on a spinning vertical spit, featuring distinct origins, spice profiles, and toppings.', 1000, 4, 6);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (7, 'Tteokbokki', 'korean', 'a popular Korean comfort and street food made from chewy cylindrical rice cakes cooked in a rich, sweet, and spicy red chili sauce.', 300, 1.2, 77);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (8, 'Eomuk', 'korean', 'Eomuk (어묵) is a popular Korean fish cake made from ground white fish meat, starch, flour, and seasonings. It is commonly shaped into thin sheets, cylinders, or balls, and prepared by frying or steaming.', 500, 2.3, 15);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (9, 'Gimbap/Kimbap', 'korean', 'a popular Korean dish made of cooked rice, vegetables, meat, or fish cake rolled in dried seaweed sheets and sliced into bite-sized pieces.', 250, 3.4, 51);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (10, 'Gisa/Gamja', 'korean', 'Gil-gamja (길감자) is a viral Korean street food snack made of potatoes and starch that is crispy on the outside and stretchy or chewy on the inside. The word gamja means potato in Korean.', 299, 4.1, 22);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (11, 'Twigim', 'korean', 'Twigim is a popular Korean street food consisting of vegetables, meat, or seafood coated in a light batter and deep-fried. It is very similar to Japanese tempura and is commonly served with soy dipping sauce or spicy tteokbokki sauce.', 40, 5, 31);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (12, 'Jianbing', 'chinese', 'Jianbing is a popular traditional Chinese street food that resembles a savory breakfast crêpe, featuring a thin grain batter, cracked eggs, and crunchy fillings folded into a warm, handheld pocket.', 60, 4.5, 22);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (13, 'Roujiamo', 'chinese', ' is a popular Chinese street food often called a "Chinese hamburger". It features tender, slow-cooked meat stuffed inside a crispy, chewy flatbread. This dish comes from the Shaanxi province and has a history that goes back thousands of years.', 85, 4.6, 41);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (14, 'Cong You Bing', 'chinese', 'savory, unleavened Chinese flatbread known for wheat flour, minced scallions, and oil.', 80, 4.7, 33);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (15, 'Xiaolongbao', 'chinese', 'Xiaolongbao are delicate Chinese soup dumplings featuring a thin wheat dough wrapper, savory minced pork, and a hot, flavorful broth trapped inside. They are traditionally cooked in small bamboo steaming baskets, which give the dumplings their name.', 400, 4.8, 6);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (16, 'Baozi', 'chinese', 'yeast-leavened, filled steamed buns with a soft, fluffy exterior and savory or sweet fillings, originating as a popular everyday staple in Chinese cuisine.', 50, 4.9, 1);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (17, 'Bakso', 'indonesian', ' is a popular Indonesian meatball soup featuring springy meatballs, a savory clear broth, and noodles.', 60, 4.5, 2);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (18, 'Mie Ayam', 'indonesian', ' comfort food consisting of yellow wheat noodles, savory seasoned diced chicken, and a side of clear broth.', 65, 4.6, 51);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (19, 'Siomay', 'indonesian', 'a popular Indonesian steamed fish dish, fish dumplings, and steamed vegetables served with a thick peanut sauce. Inspired by Chinese shumai, it is a beloved street food in Indonesia.', 40, 4.7, 21);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (20, 'Ketoprak', 'indonesian', 'Ketoprak is a famous Indonesian street food that acts like a savory tofu and rice noodle salad, made with fried tofu, rice cakes, and rice vermicelli.', 80, 4.8, 34);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (21, 'Martabak Telur', 'indonesian', 'Martabak telur is a popular savory Indonesian street food consisting of a crispy pan-fried folded pancake stuffed with a seasoned mixture of eggs, minced meat, and scallions.', 15, 4.9, 19);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (22, 'Nasi Goreng', 'indonesian', 'Nasi goreng is Indonesian popular national dish of fried rice flavored with sweet soy sauce, shrimp paste, and chili, and typically topped with a fried egg and crackers.', 10, 3.6, 2);
insert into "cuisines" ("id", "name", "cuisine", "description", "price", "rate", "review") overriding system value values (23, 'Sate Ayam', 'indonesian', 'Sate ayam is a famous Indonesian dish made of small pieces of grilled chicken on wooden sticks, served with peanut sauce, sweet soy sauce, and rice cakes.', 60, 3.5, 1);

CREATE TABLE "llm_results" (
	"llm_results_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "llm_results_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"llm_input" varchar(1000) NOT NULL,
	"llm_output" varchar(1000) NOT NULL,
	"llm_input_embedding" vector(1536) NOT NULL,
	"created_date" timestamp
);
CREATE UNIQUE INDEX "llm_results_id_pkey" ON "llm_results" ("llm_results_id");
CREATE UNIQUE INDEX "llm_results_pkey" ON "llm_results" ("llm_results_id");

CREATE TABLE "user_cart" (
	"user_cart_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_cart_user_cart_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(40) NOT NULL,
	"price_per_item" integer NOT NULL,
	"quantity" integer NOT NULL,
	"final_price" integer NOT NULL,
	"options" varchar(200) NOT NULL,
	"flag" text NOT NULL,
	"cuisine_id" smallint NOT NULL,
	"cuisine_name" varchar(50) NOT NULL,
	"user_order_id" integer
);
CREATE INDEX "user_cart_index_flag" ON "user_cart" ("flag");
CREATE UNIQUE INDEX "user_cart_pkey" ON "user_cart" ("user_cart_id");
ALTER TABLE "user_cart" ADD CONSTRAINT "user_cart_fk_cuisine_id" FOREIGN KEY ("cuisine_id") REFERENCES "cuisines"("id");
ALTER TABLE "user_cart" ADD CONSTRAINT "user_cart_fk_user_order_id" FOREIGN KEY ("user_order_id") REFERENCES "user_order"("user_order_id");

CREATE TABLE "user_chat_main" (
	"user_chat_main_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_chat_main_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(40) NOT NULL,
	"message" varchar(500) NOT NULL,
	"role" varchar(10) NOT NULL,
	"created_date" timestamp,
	"message_type" varchar(200)
);
CREATE UNIQUE INDEX "user_chat_main_pkey" ON "user_chat_main" ("user_chat_main_id");

CREATE TABLE "user_order" (
	"user_order_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"flag" varchar(20) NOT NULL,
	"created_date" timestamp,
	"cooked_date" timestamp,
	"shipped_date" timestamp,
	"delivered_date" timestamp,
	"cancelled_date" timestamp,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"street_address" varchar(100),
	"second_address" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"zip_code" varchar(100),
	"phone_number" varchar(100),
	"email_address" varchar(100),
	"additional_info" varchar(400)
);
CREATE UNIQUE INDEX "user_order_pkey" ON "user_order" ("user_order_id");