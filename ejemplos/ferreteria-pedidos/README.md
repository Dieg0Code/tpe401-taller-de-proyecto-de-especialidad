# Demo: pedidos de una ferretería

Este es un **caso ilustrativo**, no el desafío asignado a ningún equipo. La ferretería de Osorno recibe pedidos por WhatsApp y los anota en un cuaderno. La demo muestra una posible primera versión de un sistema que registra cada pedido y permite seguirlo hasta su entrega.

## Cómo abrirla

Abre `index.html` en un navegador. No requiere instalar paquetes ni crear una cuenta. Los pedidos se guardan en el almacenamiento local de ese navegador. «Restablecer datos de ejemplo» devuelve los cuatro pedidos ficticios iniciales.

## Prueba el flujo

1. Busca el pedido de Camila y observa que está **por preparar**.
2. Pulsa **Iniciar preparación**, luego **Marcar listo** y **Marcar entregado**. Observa cómo cambian el estado y los contadores.
3. Crea un pedido con **Nuevo pedido**. Comprueba que aparece en la bandeja y que sigue allí al recargar la página.
4. Filtra por estado y busca por cliente o producto.

## Segundo flujo: corregir un pedido

El cliente de Camila aclara que necesita **3 cajas de tornillos**, no 2. Busca su pedido y pulsa **Editar** mientras esté «Por preparar». Cambia la cantidad, guarda y recarga la página para comprobar que la corrección persiste. El número del pedido y su estado deben seguir iguales. Después, pulsa **Iniciar preparación**: la opción de editar desaparece para evitar cambios silenciosos durante el trabajo del mesón.

Esta función nace de una necesidad distinta a registrar pedidos: un mensaje puede contener un error o el cliente puede aclararlo antes de que la ferretería empiece a preparar. La evidencia es el pedido corregido, con el mismo número y estado, después de recargar.

## Del problema al software

| Necesidad observada | Función de la demo | Evidencia que podrías mostrar |
| --- | --- | --- |
| Un pedido anotado en el cuaderno puede perderse | Registrar cliente, contacto y productos | Crear un pedido y encontrarlo después de recargar |
| El cliente aclara un dato antes de la preparación | Editar un pedido pendiente | Corregir la cantidad y comprobar que se conserva al recargar, sin cambiar número ni estado |
| El mesón no sabe en qué va cada pedido | Cambiar su estado en una secuencia visible | Mostrar el pedido y los contadores antes y después del cambio |
| Hay que responder al cliente si puede retirar | Filtrar los pedidos listos | Mostrar la lista de pedidos «Listos para retiro» |

Esta demo **no envía mensajes**, no maneja inventario y no comparte datos entre computadores. «Listo para retiro» indica al mesón que puede avisar al cliente por el canal que ya usa. Esas limitaciones son decisiones de alcance que habría que validar con la organización real antes de construir su sistema.

Para tu proyecto, el punto de partida es averiguar la necesidad de la organización que elijas con tu equipo. Después podrás definir alcance, requerimientos y funciones. La propuesta de proyecto documenta esas mismas decisiones y el software permite comprobarlas.
