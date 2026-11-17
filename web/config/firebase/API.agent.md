# 🔌 MagnopVS API Specification

Versión: 1.0.0

Proyecto: MagnopVS

Backend:
Supabase PostgreSQL

Autenticación:
Firebase Authentication

Formato:
REST API + Edge Functions (Supabase)

Respuesta:
JSON

Codificación:
UTF-8

---

# Arquitectura

Cliente

↓

Firebase Authentication

↓

JWT Token

↓

Supabase API

↓

PostgreSQL

---

# Autenticación

La autenticación es responsabilidad exclusiva de Firebase.

La API nunca recibe contraseñas.

La API únicamente recibe el JWT emitido por Firebase.

Authorization:

Bearer <Firebase JWT>

---

# Formato de Respuesta

Éxito

{
    "success": true,
    "data": {}
}

Error

{
    "success": false,
    "message": "",
    "error_code": ""
}

---

# Versionado

Todas las rutas comienzan por:

/api/v1/

Ejemplo

/api/v1/profile

---

# Módulos

Authentication

Profiles

Wallet

Inventory

Marketplace

Heroes

MagFam

Cards

Achievements

MLH

Atlas

Quantvm Matrix

Events

Social

Notifications

Analytics

Administration

---

# Profiles

Obtener perfil

GET

/api/v1/profile

Crear perfil

POST

/api/v1/profile

Actualizar perfil

PUT

/api/v1/profile

Eliminar perfil

DELETE

/api/v1/profile

---

# Wallet

Consultar saldo

GET

/api/v1/wallet

Historial

GET

/api/v1/wallet/history

Transferir

POST

/api/v1/wallet/transfer

Comprar

POST

/api/v1/wallet/purchase

---

# Inventory

Inventario

GET

/api/v1/inventory

Agregar objeto

POST

/api/v1/inventory

Eliminar objeto

DELETE

/api/v1/inventory/{id}

---

# Marketplace

Productos

GET

/api/v1/marketplace

Detalle

GET

/api/v1/marketplace/{id}

Comprar

POST

/api/v1/marketplace/buy

Publicar

POST

/api/v1/marketplace/sell

Cancelar venta

DELETE

/api/v1/marketplace/{id}

---

# Heroes

Lista

GET

/api/v1/heroes

Detalle

GET

/api/v1/heroes/{id}

Desbloquear

POST

/api/v1/heroes/unlock

---

# Cards

Colección

GET

/api/v1/cards

Abrir sobre

POST

/api/v1/cards/open-pack

---

# MagFam

Lista

GET

/api/v1/magfam

Invocar

POST

/api/v1/magfam/summon

Evolucionar

POST

/api/v1/magfam/evolve

---

# MLH

Estado

GET

/api/v1/mlh

Actualizar progreso

PUT

/api/v1/mlh

---

# Atlas Cósmico

Mapa

GET

/api/v1/atlas

Nodo

GET

/api/v1/atlas/node/{id}

Descubrir

POST

/api/v1/atlas/discover

---

# Quantvm Matrix

Cursos

GET

/api/v1/matrix

Contenido

GET

/api/v1/matrix/content/{id}

Progreso

GET

/api/v1/matrix/progress

Actualizar progreso

PUT

/api/v1/matrix/progress

---

# Social

Amigos

GET

/api/v1/friends

Enviar solicitud

POST

/api/v1/friends/request

Aceptar solicitud

POST

/api/v1/friends/accept

---

# Notifications

Lista

GET

/api/v1/notifications

Marcar como leída

PUT

/api/v1/notifications/{id}

---

# Analytics

Resumen

GET

/api/v1/analytics

---

# Administration

Usuarios

GET

/api/v1/admin/users

Roles

GET

/api/v1/admin/roles

Logs

GET

/api/v1/admin/logs

---

# Códigos HTTP

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

---

# Seguridad

Todas las peticiones requieren JWT de Firebase.

Todas las consultas se validan mediante Row Level Security (RLS) en Supabase.

Nunca se expone información sensible.

Nunca se devuelve información de otro usuario sin permisos.

---

# Objetivo Final

La API de MagnopVS debe permitir que cualquier cliente (Web, Android, iOS, Desktop o futuras integraciones) interactúe con el universo de MagnopVS de forma segura, consistente y escalable.