package com.tienda_ropa.ecommerce.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

@Service
public class FirebaseUserService {

    public void actualizarEmail(String uid, String nuevoEmail) throws Exception {
        UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid)
                .setEmail(nuevoEmail);

        FirebaseAuth.getInstance().updateUser(request);
    }
}
