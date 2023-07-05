const { db } = require("../server");
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());


const saltRounds = 8;

// Simuler une base de données d'utilisateurs
// const users = [
//   { id: 1, username: 'john', password: '$2b$10$86OiKALFnZif81sDqr/AGeG6RZw5kfs92P81yKK2TX5jLMHzgz0Yi' } // Mot de passe : secret
// ];

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }
  jwt.verify(token, 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
}
// Route de connexion
app.post('/users/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  });
});
// Route protégée
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Page protégée' });
});
// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});



const path = (app) => {

  app.get("/users", (req, res) => {
    const q = "SELECT * FROM users";
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  app.post("/users", async (req, res) => {
    const nom = req.body.nom;
    const prenom = req.body.prenom;    
    const mot_de_passe = req.body.mot_de_passe;
    const encryptedPassword = await bcrypt.hash(mot_de_passe, saltRounds)
    const mail = req.body.mail;
    const roles = req.body.roles;
    if (!nom) {
      res.status(400).json({ error: "Le nom est obligatoire" });
      return;
    }
    if (!prenom) {
      res.status(400).json({ error: "Le prenom est obligatoire" });
      return;
    }
    if (!mot_de_passe) {
      res.status(400).json({ error: "Le mot de passe est obligatoire" });
      return;
    }
    if (!mail) {
      res.status(400).json({ error: "Le mail est obligatoire" });
      return;
    }
    if (!roles) {
      res.status(400).json({ error: "Le role est obligatoire" });
      return;
    }
    db.query(
      "INSERT INTO users(nom, prenom, mot_de_passe, mail, roles) VALUES(?, ?, ?, ?, ?)",
      [nom, prenom, encryptedPassword, mail, roles],
      (error, data) => {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur du serveur");
        } else {
          res.status(201).json({ message: "Utilisateur créé avec succès" });
        }
      }
    );
  });
  
  app.put("/users/:id", async (req, res) => {
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const mot_de_passe = req.body.mot_de_passe;
    const encryptedPassword = await bcrypt.hash(mot_de_passe, saltRounds)
    const mail = req.body.mail;
    const roles = req.body.roles;    
    const id_users = req.params.id;
    db.query(
      "UPDATE users SET nom = ?, prenom = ?, mot_de_passe = ?, mail = ?, roles = ? WHERE id_users = ?",
      [nom, prenom, encryptedPassword, mail, roles, id_users],
      (error, data) => {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur du serveur");
        } else {
          res.status(201).json({ message: "User modifié avec succès" });
        }
      }
    );
  });

  app.patch("/users/:id/:value", async (req, res) => {
    const id_users = req.params.id;
    let value = {};
    if (req.params.value === "nom") {
      value = req.body.nom;
      reqSql = "UPDATE users SET nom = ? WHERE id_users = ?";
    } else if (req.params.value === "prenom") {
      value = req.body.prenom;
      reqSql = "UPDATE users SET prenom = ? WHERE id_users = ?";
    } else if (req.params.value === "mot_de_passe") {
      value = req.body.mot_de_passe;
      reqSql = "UPDATE users SET mot_de_passe = ? WHERE id_users = ?";
    } else if (req.params.value === "mail") {
      value = req.body.mail;
      reqSql = "UPDATE users SET mail = ? WHERE id_users = ?";
    } else if (req.params.value === "roles") {
      value = req.body.roles;
      reqSql = "UPDATE users SET roles = ? WHERE id_users = ?";
    } else {
      console.error("error");
    }
    db.query(reqSql, [value, id_users], (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur du serveur");
      } else {
        res.status(201).json({ message: "Utilisateur modifié avec succès" });
      }
    });
  });
  
  app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM users WHERE id_users = ?", [id], (err, results) => {
      if (err) throw err;
      if (results.affectedRows === 0) {
        res.status(404).send("user non trouvé");
      } else {
        res.status(200).json({ message: "user supprimé avec succès" });
      }
    });
  });

//   async function findUser(email, password){
//     const user = await findOne({email});
//     if(!user) throw new Error('Erreur, pas possible de se connecter')
//     const isPasswordValid = await bcrypt .compare(password, user.password);
//     if (!isPasswordValid) throw new Error('Erreur, pas possible de se connecter');
//     if(this.isModified('password')) this.password = await bcrypt.hash(this.password, 8);
//     return user;
// }

  // app.post('/users/login', async (req, res) => {
  //   //authentification
  //     try {
  //     const user = await findUser(req.body.mail, req.body.mot_de_passe);
  //     res.send(user);
  //     } catch (error) {
  //     res.status(400).send(error);
  //     };
  //     });

  // app.post('/users/signin', (req, res) => {
  //   const { nom, mot_de_passe } = req.body
  //   if (!nom || !mot_de_passe || users[nom] !== mot_de_passe) {
  //     return res.status(401).end();
  //   };
  //   const token = jwt.sign({ nom }, jwtKey, {
  //     algorithm: 'HS256',
  //     expiresIn: jwtExpirySeconds,
  //   });
  //   res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
  //   // res.end();
  // });

  // app.get('/users/welcome', (req, res) => {
  //   const token = req.cookies.token
  //     if (!token) {
  //     return res.status(401).end();
  //   };
  //   var payload
  //   try {
  //    payload = jwt.verify(token, jwtKey)
  //   } catch (e) {
  //     if (e instanceof jwt.JsonWebTokenError) {
  //       return res.status(401).end();
  //     }
  //     return res.status(400).end();
  //   }
  //  res.send(`Welcome ${payload.username}!`);
  // });

  // app.post('/users/refresh', (req, res) => {
  //   const token = req.cookies.token  
  //   if (!token) {
  //     return res.status(401).end();
  //   };
  //   var payload;
  //   try {
  //     payload = jwt.verify(token, jwtKey);
  //   } catch (e) {
  //     if (e instanceof jwt.JsonWebTokenError) {
  //       return res.status(401).end()
  //     };
  //     return res.status(400).end();
  //   };
  //    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
  //   if (payload.exp - nowUnixSeconds > 30) {
  //     return res.status(400).end();
  //   };
  //   const newToken = jwt.sign({ username: payload.username }, jwtKey, {
  //     algorithm: 'HS256',
  //     expiresIn: jwtExpirySeconds
  //   });
  //   res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 });
  //   res.end();
  // });


  // app.get('/users/logout', (req, res) => {
  //   res.cookie('token', '', { maxAge: 0 });
  //   res.end();
  // });
  
  
};



module.exports = path;
