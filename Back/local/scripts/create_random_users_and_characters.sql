DO $$
DECLARE
    user_id UUID;
    class_type CharacterClass;
    class_types CharacterClass[] := ARRAY['Warrior', 'Mage', 'Thief'];
    i INT;
BEGIN
    FOR i IN 1..10 LOOP
        -- Insert a random user
        INSERT INTO "user" (username, password)
        VALUES (
            'User' || floor(random() * 9999 + 1)::text, -- Random username
            md5(random()::text) -- Random hashed password
        )
        RETURNING id INTO user_id;

        -- Select a random class type from the array
        class_type := class_types[floor(random() * array_length(class_types, 1)) + 1];

        -- Insert a random character for the newly created user
        INSERT INTO "character" (classType, hp, normalAttack, heavyAttack, defense, money, level, gearScore, xp, imageUrl, "userId")
        VALUES (
            class_type, -- Random class type
            100, -- Base HP
            10, -- Normal attack
            20, -- Strong attack
            5, -- Defense
            0, -- Money
            1, -- Level
            0, -- Gear score
            0, -- Experience points
            '', -- Image URL
            user_id -- Associate this character with the user created above
        );
    END LOOP;
END $$;