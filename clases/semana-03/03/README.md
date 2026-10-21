# Clase 08 - Semana 03 - Requerimientos, pantallas y modelo de datos

- **Unidad:** 01 · Generación de un Proyecto de Especialidad Innovador
- **Fecha:** Miércoles 21 de octubre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial · taller en equipos de proyecto
- **Docente:** Diego Obando

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de elaborar un diseño inicial de una operación
principal de su proyecto, relacionando la necesidad del usuario con requerimientos verificables,
una historia de usuario, un recorrido de pantallas y un primer modelo de base de datos.

Cada equipo trabaja sobre su propio caso y la información disponible: revisa qué hará el sistema,
qué queda fuera y qué decisiones todavía son supuestos. El diseño permite comprobar si el alcance
propuesto se puede explicar mediante acciones, resultados y datos concretos, y precisar la
delimitación y el producto esperado de la propuesta de proyecto.

El ejemplo conductor es una **ferretería ficticia de Osorno** que recibe pedidos por WhatsApp y
los anota en un cuaderno. Se utiliza para mostrar el procedimiento; cada equipo lo aplica a su
proyecto asignado. Los ejemplos de funciones, pantallas y tablas son propuestas didácticas, no
requisitos que deban copiarse a todos los sistemas.

## Objetivos Específicos

1. **Delimitar una primera versión del sistema**, distinguiendo usuarios, funciones necesarias,
   exclusiones y supuestos, y formular requerimientos funcionales y no funcionales que se puedan
   comprobar.
2. **Relacionar un requerimiento con una historia de usuario y sus criterios de aceptación**,
   describiendo qué necesita hacer la persona y qué resultado debe obtener.
3. **Representar el recorrido de una operación mediante bocetos de pantallas**, indicando los
   datos que se ingresan, las acciones del sistema, las validaciones y los resultados que se
   muestran, incluidos los casos en que faltan datos o no se encuentra información.
4. **Derivar los datos que necesita guardar el sistema**, identificando entidades, atributos y
   relaciones a partir de esa operación, y proponer tablas con claves primarias y foráneas que
   representen esas relaciones.
5. **Comprobar la coherencia del diseño con un caso de prueba**, explicando cómo se conectan el
   requisito, la historia, las pantallas, los datos guardados y el resultado esperado, y registrar
   las decisiones que todavía necesitan aclaración.

---

# El método: seis estaciones para diseñar una operación

Una **operación** es una acción completa que una persona realiza con el sistema para obtener un
resultado útil. Para diseñar cualquier software, sea el proyecto de este módulo o uno futuro, se
elige una operación principal y se recorre por seis estaciones, en orden. Cada estación responde
una pregunta, y su respuesta es el punto de partida de la siguiente:

| Estación | Pregunta que responde | Dónde se trabaja |
| --- | --- | --- |
| 1 · Necesidad | ¿Quién necesita conseguir qué, y qué operación completa le da ese resultado? | Bloque 1 |
| 2 · Requerimientos | ¿Quién actúa, qué ingresa, qué hace el sistema y qué resultado se puede observar? ¿Cómo se comprueba su calidad? | Bloque 1 |
| 3 · Historia y criterios | ¿Cómo se reconoce que la operación quedó resuelta, también cuando falta un dato o falla el guardado? | Bloque 2 |
| 4 · Recorrido y pantallas | ¿Qué hace la persona, qué responde el sistema y qué ocurre si no puede continuar? | Bloque 2 |
| 5 · Datos y tablas | ¿Qué debe poder recuperarse después, a qué pertenece cada dato y cómo se conectan los registros? | Bloques 3 y 4 |
| 6 · Prueba | Con datos concretos, ¿se guarda y se recupera lo que exige la historia? | Bloque 4 y cierre |

Las estaciones no se recorren una sola vez. Si una respuesta no calza con la de una estación
anterior, se vuelve a esa estación y se ajusta: por ejemplo, si el recorrido exige un dato que el
modelo no conserva, se revisa el modelo.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
| --- | --- | --- |
| 08:30 - 08:35 | Encuadre | Elegir una operación principal del proyecto para desarrollar durante el taller y reconocer el recorrido: necesidad → requerimientos → historia → pantallas → datos → comprobación. |
| 08:35 - 09:00 | Bloque 1 · Delimitar y precisar requerimientos | Revisar usuarios, problema y alcance de la primera versión. Distinguir acuerdos, propuestas y supuestos. Redactar funciones concretas y condiciones de calidad verificables para la operación elegida, dejando explícito qué queda fuera. |
| 09:00 - 09:30 | Bloque 2 · Historias, recorridos y pantallas | Escribir la historia de la operación y sus criterios de aceptación. Recorrerla paso a paso y dibujar las pantallas necesarias: qué ingresa la persona, qué comprueba o calcula el sistema y qué resultado aparece. Distinguir el trabajo de la pantalla, la lógica y el almacenamiento. |
| 09:30 - 09:40 | Pausa | Descanso. |
| 09:40 - 10:10 | Bloque 3 · Obtener los datos desde la operación | Seguir un ejemplo con datos concretos e identificar qué información debe guardarse y a qué entidad pertenece. Proponer atributos y relaciones, indicando cuántos registros pueden vincularse. Distinguir los datos generales de un producto de los que pertenecen a una operación, como la cantidad de ese producto en un pedido. |
| 10:10 - 10:40 | Bloque 4 · Proponer tablas y comprobar el diseño | Traducir el modelo inicial a tablas con identificadores y relaciones mediante claves primarias y foráneas. Reconocer cuándo se necesita una tabla de detalle. Probar el recorrido con datos de ejemplo y comprobar que el diseño permite guardar y recuperar lo que exige la historia. |
| 10:40 - 10:50 | Cierre | Revisar en equipo la relación entre requisito, historia, pantallas, tablas y prueba. Registrar el diseño inicial y los pendientes, y contrastar esas decisiones con la delimitación y el producto esperado de la propuesta. |

> Ten a mano la propuesta de proyecto, la información disponible del caso y las historias que el
> equipo ya haya escrito. Durante el taller se construye y revisa el diseño de una operación
> principal; los bocetos y el modelo de datos se ajustan a medida que se precisan sus reglas.

---

# BLOQUE 1: Delimitar y precisar requerimientos

**Duración:** 25 minutos · 08:35 - 09:00  
**Objetivo:** delimitar una primera versión del proyecto y precisar una operación mediante
requerimientos funcionales, condiciones de calidad y reglas que permitan comprobar su resultado.

## 1.1 Elegir una operación y delimitar la primera versión

En la **ferretería ficticia** los pedidos llegan por WhatsApp y se anotan en un cuaderno. Cuando
un cliente consulta, cuesta encontrar qué pidió y en qué estado está. La persona que atiende en
el mesón necesita registrar los pedidos y recuperarlos después para responder.

La **necesidad** es lo que esa persona busca conseguir: conservar y encontrar la información del
pedido. Una **operación** es una acción completa que realiza con el sistema para obtener un
resultado útil. Por ejemplo, registrar un pedido y recibir su número para consultarlo después.

El **alcance de la primera versión** indica qué resolverá el sistema en esa versión y qué quedará
fuera. Para el ejemplo se propone:

| Decisión de alcance | Propuesta para la ferretería ficticia |
| --- | --- |
| Quién utiliza el sistema | La persona que atiende en el mesón |
| Qué podrá hacer | Registrar un pedido, consultarlo por número y marcarlo como listo para retiro |
| Qué significa «listo para retiro» | Todos los productos del pedido ya están preparados |
| Qué queda fuera de esta versión | Cobrar dentro del sistema, planificar repartos y enviar mensajes automáticos |
| Qué operación se diseñará en este taller | Registrar un pedido con sus productos y cantidades |

Las otras funciones siguen dentro de la versión propuesta, pero el recorrido del taller se
concentra en el registro. Así se puede seguir una misma operación hasta sus pantallas y sus datos.
Todas las decisiones de esta tabla son **didácticas**; cada equipo delimita su propio proyecto.

### Distinguir lo informado de lo propuesto

Cada decisión debe conservar su procedencia y su estado:

- **Información del caso o acuerdo confirmado:** se registra la fuente y lo que efectivamente
  indica. Una nota de reunión no convierte todas las ideas mencionadas en funciones aprobadas.
- **Propuesta del equipo:** una alternativa que se presenta para discutir, por ejemplo, una forma
  de organizar la navegación. Todavía no se atribuye al **referente**, la persona de la
  organización que representa el caso.
- **Supuesto de trabajo:** una decisión provisional que el equipo adopta para avanzar y que aún
  necesita confirmación. Se escribe qué se está suponiendo y qué decisión depende de ello.

Una **exclusión** es algo que se ha dejado fuera del alcance. No se trata como una pregunta
pendiente ni se incorpora porque otro sistema parecido lo tenga. Los supuestos, en cambio,
pueden contrastarse y modificarse al contar con más información.

## 1.2 Escribir funciones con un resultado observable

Un **requerimiento** es una capacidad o condición que el sistema debe cumplir. Un **requerimiento
funcional** describe qué debe hacer: registrar, consultar, modificar, calcular o impedir una
operación cuando no se cumplen sus condiciones.

«Gestionar pedidos» todavía deja abiertas muchas acciones. Para la operación elegida se propone:

> El sistema debe permitir a la persona del mesón registrar un pedido con el cliente, los
> productos y sus cantidades. Al guardarlo, debe asignarle un número único, mostrarlo y permitir
> recuperar la información registrada mediante ese número.

**Número único** significa que dos pedidos distintos no comparten el mismo identificador.
Mostrar un mensaje de éxito no basta para comprobar el guardado: al consultar el número deben
aparecer los datos del pedido que se registró.

Para precisar una función, responde:

| Parte que se necesita aclarar | En el registro del pedido |
| --- | --- |
| Quién realiza la acción | La persona del mesón |
| Qué información necesita | Cliente, productos y cantidad de cada producto |
| Qué hace el sistema | Comprueba los datos, guarda el pedido y asigna un número |
| Qué resultado se puede observar | Muestra el número y permite recuperar el pedido con sus productos y cantidades |

Comprobar los datos se llama **validar**. Las validaciones se derivan de reglas concretas. En
este ejemplo se propone la **regla de negocio** «un pedido debe incluir al menos un producto y
cada cantidad debe ser mayor que cero». Una regla de negocio expresa qué es válido en la
operación, incluso si el negocio trabaja en papel.

De esa regla se deriva un comportamiento del software: si no hay productos o alguna cantidad
es cero o negativa, no se guarda el pedido y se indica qué debe corregirse. La regla y la
función describen la misma decisión desde el negocio y desde su aplicación en el sistema.

## 1.3 Precisar condiciones de calidad

Un **requerimiento no funcional** expresa una condición de calidad o una restricción de la
solución. «Que sea fácil» y «que sea rápido» necesitan concretarse para poder comprobarlos.

| Condición inicial | Propuesta verificable para el ejemplo | Cómo se comprueba |
| --- | --- | --- |
| Poder registrar desde celular | El formulario debe permitir completar los campos, ver las validaciones y pulsar Guardar en una pantalla de 360 píxeles de ancho, sin desplazamiento horizontal | Configurar ese ancho en la vista móvil del navegador y recorrer el formulario completo |
| Consultar con rapidez | La consulta por número debe mostrar el resultado en un máximo de 2 segundos, con 1.000 pedidos guardados y una sola consulta a la vez | Preparar los datos de prueba y medir desde pulsar Buscar hasta ver el resultado; registrar equipo, navegador y conexión usados |

Los **360 píxeles** representan el ancho de pantalla usado para revisar la distribución del
formulario. Los **2 segundos** son el límite de respuesta propuesto y los **1.000 pedidos** son
el volumen de datos de prueba. Son valores ilustrativos, no exigencias de los proyectos del curso.
Cada equipo propone condiciones adecuadas al uso esperado y registra las que falte validar.

Las condiciones de calidad también influyen en el diseño: el uso móvil afecta la distribución
de los campos y botones; el tiempo de consulta obliga a comprobar cómo se recuperan los datos.
Se mantienen junto al requerimiento funcional al diseñar sus pantallas, su lógica y sus pruebas.

## 1.4 Aplicación al proyecto del equipo

**Trabajo sugerido: 10 minutos.** Usa una operación de tu proyecto para completar una ficha de
alcance y requerimientos. Las siguientes son **sugerencias de redacción para revisar con la
información del caso**, no una lista adicional de funciones obligatorias:

| Proyecto | Operación posible para el taller | Punto de partida para un requerimiento funcional |
| --- | --- | --- |
| Sistema de costos | Registrar los insumos utilizados en un servicio | Permitir asociar a un servicio sus insumos, la unidad de cada uno y la cantidad utilizada; mostrar los datos guardados para poder corregirlos |
| Órbita Digital | Crear una ficha de empresa | Permitir al administrador del Centro registrar una empresa con su descripción, contacto y hasta tres servicios clasificados, y consultar la ficha publicada |
| CRM Yo Compro Local | Registrar una entrega a un punto de venta | Permitir al productor guardar el punto de venta, la fecha, los productos y sus cantidades, y consultar esa entrega en el historial |

Respeta la delimitación de cada caso: el sistema de costos se centra en servicios y sus cálculos;
Órbita parte con fichas administradas por el Centro; el CRM registra operaciones del productor
hacia los puntos de venta. **Stock y rotación quedan fuera del alcance del CRM.** Registrar una
entrega no informa cuánto producto vendió el comercio al consumidor ni cuánto le queda.

Completa, en equipo:

1. **Usuario y necesidad:** quién hará la operación y qué necesita conseguir.
2. **Alcance:** qué incluye la primera versión y qué queda fuera. Elige una operación de esa versión.
3. **Función:** qué ingresará la persona, qué hará el sistema y qué resultado se observará.
4. **Calidad y reglas:** una condición de calidad comprobable y una regla de negocio pertinente,
   si la operación la necesita. Explica cómo se verificarán.
5. **Procedencia:** identifica la fuente de cada decisión; marca las propuestas y los supuestos.

La evidencia del trabajo es esta ficha inicial. Si una regla sigue sin confirmarse, conserva el
supuesto explícito y señala qué parte del diseño podría cambiar. El trabajo continúa con esa
distinción, sin inventar respuestas del referente.

## Preguntas de comprobación

1. **Función y resultado:** ¿por qué «gestionar pedidos» no basta para comenzar a diseñar la
   operación de registro?  
   **Pista:** busca quién actúa, qué ingresa y qué resultado debería poder comprobarse.
2. **Calidad verificable:** ¿qué información falta si un requisito dice solamente «debe ser
   rápido»?  
   **Pista:** piensa desde cuándo medirías, hasta cuándo y bajo qué condiciones repetirías la prueba.
3. **Supuesto y exclusión:** ¿qué diferencia hay entre una regla provisional y una función que
   quedó fuera del alcance?  
   **Pista:** revisa cuál se adopta temporalmente para avanzar y cuál se ha decidido no incorporar.

## Lo que tenía que aparecer en tu respuesta

| Pregunta | Respuesta | Lo que revela |
| --- | --- | --- |
| 1 · Función y resultado | **Faltan la acción concreta, el usuario, los datos y el resultado esperado.** En el ejemplo, registrar incluye guardar cliente, productos y cantidades, asignar un número y recuperar el pedido. | El diseño de pantallas y datos necesita describir una operación que se pueda recorrer de principio a fin. |
| 2 · Calidad verificable | **Faltan un límite medible y las condiciones de comprobación.** En el ejemplo se mide desde Buscar hasta ver el resultado, con un volumen de datos y un entorno registrados. | Una condición de calidad se comprueba sobre una función concreta, no solo escribiendo un adjetivo en el documento. |
| 3 · Supuesto y exclusión | **El supuesto es una decisión provisional por confirmar; la exclusión delimita lo que no se incorporará.** | Registrar la diferencia evita que una sugerencia se convierta en compromiso o que se reabra una función ya descartada. |

Con una operación delimitada y sus resultados claros, el siguiente paso es redactar la historia
de usuario y recorrer sus pantallas. Esa misma operación permitirá identificar después los datos
que necesita guardar el sistema.

---

# BLOQUE 2: Historias, recorridos y pantallas

**Duración:** 30 minutos · 09:00 - 09:30  
**Objetivo:** expresar la operación elegida como una historia comprobable y diseñar su recorrido
mediante bocetos de pantallas, distinguiendo entradas, validaciones, guardado y resultados.

## 2.1 Relacionar la función con una historia y sus criterios

La operación del ejemplo sigue siendo **registrar un pedido**. Una **historia de usuario**
describe una capacidad desde la perspectiva de quien la necesita y explica su beneficio:

> Como **persona que atiende en el mesón**, quiero **registrar un pedido con su cliente,
> productos y cantidades** para **conservar lo solicitado y encontrarlo cuando el cliente consulte**.

«Como» identifica a la persona que usa la capacidad; «quiero» indica lo que necesita hacer;
«para» explica el beneficio. Aquí quien utiliza el sistema es la persona del mesón. El cliente
es quien solicita los productos: ambos participan en el caso, pero no cumplen el mismo papel.

La historia conserva el propósito del requerimiento del Bloque 1. Sus **criterios de aceptación**
describen resultados observables que permiten comprobar si la capacidad quedó resuelta.
Para este ejemplo se proponen:

| Caso | Resultado esperado |
| --- | --- |
| Cliente identificado, al menos un producto y cantidades válidas | Se guarda el pedido, se asigna un número único y se muestran la confirmación y los datos registrados |
| Consulta posterior del número asignado | Se recuperan el cliente, los productos y las cantidades guardadas en ese pedido |
| Falta el cliente, no hay productos o alguna cantidad no es un número mayor que cero | Se indica qué dato debe corregirse, se conservan los otros datos del formulario y no se guarda el pedido |
| El guardado falla por un problema del sistema | Se informa que no se pudo guardar y no se muestra una confirmación de éxito |

Una cantidad **válida** en este ejemplo es un número mayor que cero. Conservar los otros datos
del formulario permite corregir el error sin volver a escribir todo. Es una decisión de diseño
propuesta para el ejercicio, junto con los demás criterios de la tabla.

Para recorrer el caso exitoso se usarán estos **datos ficticios**:

- Cliente: **Ana Soto**, nombre inventado para el ejemplo.
- Productos: **2 sacos de cemento** y **3 brochas**, cuya unidad de venta es la unidad individual.
- Resultado ilustrativo: pedido número **1042**. Es su identificador, no una cantidad de productos
  ni un número que deba asignarse siempre.

Se supone que el cliente y los productos ya están disponibles para seleccionarlos. Crear sus
registros es otra operación; para diseñar este recorrido se utilizan datos de prueba preparados.

## 2.2 Recorrer la operación antes de dibujar

Un **recorrido** es la secuencia de acciones y respuestas que permite completar una operación.
Incluye lo que ocurre cuando los datos son correctos y lo que ocurre cuando algo impide continuar.

| Paso | Acción de la persona | Respuesta del sistema |
| --- | --- | --- |
| 1 · Abrir el registro | Elige registrar un pedido | Muestra el formulario y sus campos vacíos |
| 2 · Completar | Selecciona a Ana Soto, agrega cemento con cantidad 2 y brocha con cantidad 3 | Muestra los productos agregados, sus cantidades y sus unidades |
| 3 · Solicitar guardado | Pulsa Guardar pedido | Comprueba cliente, productos y cantidades |
| 4 · Resolver la comprobación | Corrige los datos si se informa un error | Si son incorrectos, conserva el formulario y señala qué corregir; si son válidos, intenta guardar |
| 5 · Confirmar el resultado | Revisa la respuesta | Si el guardado se completa, muestra el número 1042 y los datos registrados; si falla, informa que no se pudo guardar |
| 6 · Recuperar el pedido | Usa la consulta por número e ingresa 1042 | Muestra la información guardada de ese pedido |

El paso 4 presenta dos alternativas, no dos acciones que deban ocurrir siempre. Si hay un error
en los datos, se vuelve a corregir y solicitar el guardado. La confirmación solo aparece cuando
el pedido quedó guardado. El paso 6 utiliza la función de consulta incluida en la primera versión
y permite comprobar que el registro se conserva.

Por ejemplo, si la cantidad de cemento es **0**, el sistema puede mostrar «Ingresa una cantidad
mayor que cero para Cemento» junto a ese campo. Ana Soto y la cantidad de brochas permanecen en
el formulario. Cambiar el cero por 2 y volver a pulsar Guardar permite continuar.

Esta descripción ya permite detectar pantallas y comportamientos necesarios. Dibujar primero una
página de inicio no resuelve por sí solo cómo se registra, corrige y recupera un pedido.

## 2.3 Dibujar lo necesario y distinguir responsabilidades

Un **boceto de pantalla** es una representación sencilla de los campos, acciones y resultados
que verá la persona. Puede hacerse en papel o en una herramienta de dibujo. Su función es
explicar cómo se realiza la operación; todavía no exige elegir colores, tipografías o tecnología.

### Formulario de registro

Los corchetes del siguiente boceto representan controles propuestos: campos para seleccionar o
editar datos y botones para realizar acciones. Los datos ya están completados para mostrar el
ejemplo de Ana Soto.

```text
Registrar pedido

Cliente: [Ana Soto]

Producto       Cantidad       Unidad
[Cemento]      [2]            saco
[Brocha]       [3]            unidad

[Agregar producto]
[Guardar pedido]
```

En esta propuesta, **Agregar producto** incorpora otra fila donde se selecciona un producto y
se escribe su cantidad. La unidad se muestra según el producto seleccionado. **Guardar pedido**
solicita guardar el conjunto completo, no solo la última fila.

La selección de Ana Soto representa el cliente asociado al pedido. Cada cantidad corresponde
al producto de su propia fila: 2 es la cantidad de cemento y 3 es la cantidad de brochas.
No son existencias disponibles del negocio.

### Confirmación y consulta

```text
Pedido guardado

Número: 1042
Cliente: Ana Soto

Producto       Cantidad       Unidad
Cemento        2              saco
Brocha         3              unidad

[Consultar este pedido]
[Registrar otro pedido]
```

**Consultar este pedido** abre la consulta con el número asignado y recupera su información
guardada. **Registrar otro pedido** abre un formulario vacío para una operación nueva.

Un recorrido puede usar pantallas distintas o distintas presentaciones dentro de una misma
pantalla. Una **presentación o estado de pantalla** es cómo se ve la interfaz en una situación:
vacía, completada, con errores o con confirmación. No hace falta crear una página distinta para
cada mensaje. El estado de la pantalla no es el estado de preparación del pedido.

Para el formulario se deben contemplar, al menos, la entrada inicial, los datos completados,
el error de validación y el fallo de guardado. En el uso móvil propuesto en el Bloque 1, los
controles y las filas pueden apilarse verticalmente para completar la operación sin desplazarse
hacia los lados.

### Pantalla, lógica y almacenamiento

| Parte | Responsabilidad en el ejemplo |
| --- | --- |
| Pantalla o interfaz | Permitir seleccionar cliente y productos, editar cantidades y leer mensajes y resultados |
| Lógica de la operación | Aplicar las reglas, coordinar el guardado y asegurar que cada pedido reciba un número único |
| Almacenamiento de datos | Conservar el pedido, su cliente y las cantidades de sus productos para recuperarlos después |

La **lógica** es el procesamiento que aplica las reglas de la operación. El **almacenamiento**
permite conservar la información después de abandonar la pantalla. Estas responsabilidades se
conectan, aunque el equipo todavía no haya elegido cómo implementarlas.

Un boceto con un botón Guardar representa una acción prevista; no demuestra que la información
se conserve. Para comprobar el sistema construido se debe realizar el recorrido y recuperar
los datos guardados. El boceto sirve para revisar ese comportamiento antes de programarlo.

## 2.4 Aplicación al proyecto del equipo

**Trabajo sugerido: 12 minutos.** Continúa con la operación elegida en el Bloque 1:

1. Escribe una historia que identifique **quién necesita la capacidad, qué quiere hacer y para qué**.
2. Define criterios para el caso exitoso, la falta de un dato necesario y un dato incorrecto.
   Añade el comportamiento ante un fallo de guardado si la operación conserva información.
3. Recorre la operación con datos de ejemplo identificados como ficticios. Anota qué ingresa la
   persona, qué comprueba el sistema y qué resultado aparece.
4. Dibuja los bocetos necesarios. Sitúa los campos, los botones, los mensajes de error y la
   confirmación, e indica a dónde lleva cada acción.
5. Revisa si las pantallas permiten cumplir los criterios y la condición de calidad del Bloque 1.
   Anota qué información necesitará conservar el sistema para recuperar el resultado.

| Proyecto | Qué debe permitir explicar el recorrido propuesto |
| --- | --- |
| Sistema de costos | Seleccionar un servicio, asociar un insumo con su unidad y cantidad de uso, guardar la asociación y recuperarla para corregirla; conservar explícitas las reglas de cálculo aún no confirmadas |
| Órbita Digital | El administrador registra los datos de una empresa y hasta tres servicios clasificados, corrige los datos necesarios y comprueba cómo aparece su ficha pública |
| CRM Yo Compro Local | El productor selecciona un punto de venta, registra fecha, productos y cantidades de una entrega, y la encuentra en su historial; ese recorrido no incorpora stock ni rotación |

Estas orientaciones continúan las operaciones sugeridas en el Bloque 1. Ajusta los campos y las
reglas a la información de tu caso; no conviertas los datos de la ferretería en requisitos de tu
proyecto.

La evidencia del trabajo es **una historia con sus criterios y un recorrido acompañado de
bocetos**, con las entradas y los resultados identificados. Si se usa una herramienta de IA
para revisar el diseño, entrégale el requerimiento y el alcance, y pide que señale criterios
sin respuesta en las pantallas. Verifica sus sugerencias antes de incorporarlas: una función
nueva propuesta por la herramienta no es un acuerdo del proyecto.

## Preguntas de comprobación

1. **Usuario y beneficio:** en la historia de registro, ¿quién usa el sistema y qué obtiene al
   completar la operación?  
   **Pista:** distingue a quien atiende en el mesón de quien solicita los productos.
2. **Errores y recorrido:** si la cantidad de cemento es cero, ¿qué debe ocurrir antes de poder
   mostrar «Pedido guardado»?  
   **Pista:** sigue la corrección de datos, la nueva solicitud y el resultado del guardado.
3. **Pantalla y datos:** ¿por qué dibujar un botón Guardar y un mensaje de éxito no demuestra que
   se cumplió la historia?  
   **Pista:** revisa qué debe ocurrir al consultar después el número asignado.

## Lo que tenía que aparecer en tu respuesta

| Pregunta | Respuesta | Lo que revela |
| --- | --- | --- |
| 1 · Usuario y beneficio | **La persona del mesón registra lo solicitado y puede encontrarlo cuando el cliente consulte.** Ana Soto es la cliente asociada al pedido, no quien usa el formulario en este recorrido. | Identificar correctamente al usuario permite decidir quién necesita acceso a cada pantalla. |
| 2 · Errores y recorrido | **Se señala la cantidad incorrecta y no se guarda. Tras corregirla y volver a solicitar el guardado, solo se confirma si este se completa.** | El recorrido debe explicar también cómo se recupera una operación que no pudo continuar. |
| 3 · Pantalla y datos | **El dibujo representa una intención. El sistema debe guardar el pedido y recuperar su cliente, productos y cantidades al consultar el número asignado.** | Una historia se comprueba con un resultado completo que conecta interfaz, lógica y almacenamiento. |

El recorrido ya identifica cliente, pedido, productos y cantidades. Después de la pausa, el
siguiente bloque utilizará esos datos para reconocer qué entidades necesita el sistema y cómo
se relacionan.

---

# BLOQUE 3: Obtener los datos desde la operación

**Duración:** 30 minutos · 09:40 - 10:10  
**Objetivo:** identificar las entidades, sus atributos y sus relaciones a partir de los datos
que una operación necesita guardar y recuperar.

## 3.1 Pasar del formulario a la información que debe conservarse

En el recorrido del Bloque 2 se registró el pedido ficticio **1042** de **Ana Soto**, con
**2 sacos de cemento** y **3 brochas**. Al consultar su número deben recuperarse el cliente,
los productos y las cantidades. Esos resultados indican qué información debe conservarse.

Una **base de datos** es un conjunto organizado de datos que el sistema guarda para consultarlos
y modificarlos. Un **modelo de datos** describe qué información se necesita y cómo se relaciona.
En este bloque se construye ese modelo a partir de la operación; en el siguiente se propondrán
sus tablas y claves.

Empieza por leer los datos del recorrido:

| Información del ejemplo | Qué representa | Por qué se necesita |
| --- | --- | --- |
| Ana Soto | La cliente a quien corresponde el pedido | Para saber de quién es lo solicitado y permitir que tenga otros pedidos |
| 1042 | El número que identifica un pedido concreto | Para recuperar esa operación sin confundirla con otra |
| Cemento y Brocha | Dos productos que se pueden solicitar | Para reconocer qué se pidió y volver a utilizar esos productos en otros pedidos |
| saco y unidad | La unidad de venta de cada producto | Para interpretar qué representan las cantidades |
| 2 y 3 | Lo solicitado de cada producto en el pedido 1042 | Para conservar cuánto pidió esa cliente en esa operación |

Los datos no cumplen todos la misma función. El nombre del producto sirve para reconocerlo en
muchos pedidos; la cantidad solicitada puede cambiar en cada uno. Mantener esa diferencia es
necesario para recuperar correctamente el resultado.

Tampoco todos los elementos de la pantalla necesitan almacenarse: el botón Guardar representa
una acción y el mensaje «Ingresa una cantidad mayor que cero» explica una validación. Dibujarlos
en el formulario no los convierte en datos del pedido.

## 3.2 Identificar entidades, atributos y datos de una relación

Una **entidad** representa un tipo de persona, objeto o hecho sobre el que el sistema necesita
conservar información. En este ejemplo se reconocen **Cliente**, **Producto** y **Pedido**.
Ana Soto es un caso concreto de Cliente; Cemento es un caso concreto de Producto; el pedido
1042 es un caso concreto de Pedido.

Un **atributo** es una característica que se guarda de una entidad, como el nombre de un producto.
Un **valor** es el contenido concreto de esa característica: «Cemento» es un valor del atributo
nombre. Un **registro** reúne los datos de un caso concreto; por ejemplo, los datos de ese producto.

| Entidad propuesta | Qué representa | Atributos que ya exige el recorrido |
| --- | --- | --- |
| Cliente | La persona a quien corresponde lo solicitado | Nombre |
| Producto | Un artículo del catálogo de la ferretería | Nombre y unidad de venta |
| Pedido | Una solicitud concreta de un cliente | Número de pedido |

La tabla identifica atributos descriptivos que aparecen en el ejemplo. La identificación de
registros distintos y la forma de conectar sus datos se precisarán mediante claves en el
Bloque 4. Dos clientes pueden llamarse igual: compartir nombre no significa ser la misma persona.

Para esta propuesta se supone que **cada producto tiene una unidad de venta definida**. Cemento
se solicita en sacos y Brocha en unidades individuales. Estas unidades pertenecen a los productos
del ejemplo; cada proyecto debe revisar las unidades que utiliza su propia operación.

### ¿A qué pertenece la cantidad?

Se agrega un segundo pedido ficticio, el **1043**, también de Ana Soto, que contiene **5 sacos
de cemento**. El número 1043 identifica otra operación; el 5 es la cantidad solicitada en ella.

| Pedido | Cliente | Producto | Cantidad | Unidad |
| --- | --- | --- | --- | --- |
| 1042 | Ana Soto | Cemento | 2 | saco |
| 1042 | Ana Soto | Brocha | 3 | unidad |
| 1043 | Ana Soto | Cemento | 5 | saco |

Esta tabla permite leer los dos pedidos y comparar sus datos; todavía no es la propuesta de
tablas de la base de datos.

El mismo producto, Cemento, aparece con cantidades diferentes. Si se guardara una sola cantidad
solicitada dentro de Producto, no se podrían representar a la vez los 2 sacos del pedido 1042
y los 5 del pedido 1043.

Por eso, **la cantidad solicitada pertenece a la relación entre un pedido y un producto**. Cada
aparición de un producto dentro de un pedido se denomina **línea de pedido** o **detalle de
pedido**. La línea de Cemento del pedido 1042 tiene cantidad 2; la del pedido 1043 tiene cantidad 5.
El Bloque 4 utilizará esta información para proponer una tabla de detalle.

## 3.3 Describir relaciones y cuántos registros pueden vincularse

Una **relación** expresa cómo se vinculan las entidades. En el ejemplo, un cliente realiza
pedidos y un pedido incluye productos. Para precisarla hay que preguntar en ambos sentidos:
«¿Cuántos pedidos puede tener un cliente?» y «¿A cuántos clientes corresponde un pedido?».

La **cardinalidad** indica cuántos casos de una entidad pueden relacionarse con un caso de otra.
Las reglas del ejemplo se describen así:

| Relación | Desde el primer lado | Desde el otro lado |
| --- | --- | --- |
| Cliente y Pedido | Un cliente puede estar registrado sin pedidos o tener varios | Cada pedido guardado corresponde a un solo cliente |
| Pedido y Producto | Un pedido guardado incluye uno o varios productos | Un producto puede no aparecer todavía en pedidos o aparecer en varios |

La relación entre Cliente y Pedido es **uno a muchos**: un cliente puede tener varios pedidos,
pero cada pedido corresponde a un cliente. La relación entre Pedido y Producto es **muchos a
muchos**: un pedido puede incluir varios productos y un producto puede aparecer en varios pedidos.

Estas denominaciones resumen las cantidades máximas. También hay que expresar el mínimo:
«puede no tener pedidos» permite cero; «un pedido guardado incluye uno o varios productos»
exige al menos uno. El formulario vacío es un borrador en pantalla, no un pedido guardado válido.

Los datos permiten comprobar esas reglas:

- Ana Soto está vinculada a los pedidos 1042 y 1043: una cliente, dos pedidos.
- El pedido 1042 incluye Cemento y Brocha: un pedido, dos productos distintos.
- Cemento aparece en 1042 y 1043: un producto, dos pedidos.
- Cada línea conserva su propia cantidad. Los **2 sacos** del pedido 1042 son dos unidades de
  la unidad de venta; no representan dos productos diferentes del catálogo.

La relación muchos a muchos y la cantidad de cada línea explican por qué se necesita representar
el detalle del pedido. Los datos de prueba ayudan a descubrir esa necesidad antes de construir
las tablas.

### Una pantalla no determina una entidad

El formulario reúne cliente, pedido y productos porque la persona los necesita para completar
una operación. Eso no significa que todos deban guardarse como un único registro.

Del mismo modo, una pantalla puede mostrar datos de varias entidades y una entidad puede
utilizarse en varias pantallas. La confirmación y la consulta recuperan información del mismo
pedido; no representan pedidos adicionales.

Para justificar una entidad, explica qué representa, qué datos necesita conservar y en qué
operación se utilizan. Encontrar una palabra en el relato es una pista inicial, pero no basta
por sí sola para convertirla en una entidad del sistema.

## 3.4 Aplicación al proyecto del equipo

**Trabajo sugerido: 12 minutos.** Usa el recorrido y los bocetos del Bloque 2:

1. Completa la operación con datos ficticios y anota qué información debe poder recuperarse
   después. Distingue los valores ingresados de los botones y mensajes de la pantalla.
2. Propón las entidades necesarias. Para cada una, escribe qué representa y sus atributos
   iniciales, indicando qué parte de la operación justifica guardarlos.
3. Describe sus relaciones en ambos sentidos. Expresa si se permite ningún registro, uno o
   varios; conserva como supuesto cualquier regla que el caso aún no confirme.
4. Prueba un segundo caso que reutilice información: otro pedido del mismo cliente, otro servicio
   con un mismo insumo o una nueva entrega con un producto ya utilizado, según tu proyecto.
5. Identifica qué dato cambia entre esas operaciones y a qué relación pertenece. Revisa si tu
   modelo permite conservar ambos casos sin reemplazar el primero.

Las siguientes son **orientaciones de modelado para discutir**, no esquemas finales:

| Proyecto | Entidades que conviene examinar | Relación y dato que se debe distinguir |
| --- | --- | --- |
| Sistema de costos | Servicio e Insumo | Un servicio utiliza insumos y un insumo puede utilizarse en distintos servicios. La cantidad consumida corresponde al uso de ese insumo en un servicio; no es una cantidad única del insumo para todos los servicios |
| Órbita Digital | Empresa, servicio ofrecido y categoría o etiqueta, según la clasificación acordada | Una empresa presenta hasta tres servicios. Distinguir los datos de la empresa, la descripción de lo que ofrece y la clasificación que permite encontrarla. Representar servicios como datos no obliga a crear páginas públicas por servicio |
| CRM Yo Compro Local | Productor, Punto de venta, Entrega y Producto | Una entrega corresponde a un productor y un punto de venta, y contiene productos con sus cantidades. La cantidad entregada pertenece al producto dentro de esa entrega; no expresa stock ni rotación del comercio |

En Órbita, confirma qué se reutiliza entre empresas: categorías, etiquetas o tipos de servicio.
El límite de tres servicios no decide por sí solo cómo deben representarse esas clasificaciones.
En costos, conserva las unidades de consumo y las reglas de cálculo que todavía sean supuestos.
En CRM, una entrega sigue siendo una operación del productor hacia el punto de venta.

La evidencia del trabajo es **un modelo inicial con entidades, atributos, relaciones y sus
cantidades permitidas**, acompañado de dos casos ficticios que permitan comprobarlo. Puede
representarse con cajas y líneas rotuladas o con una tabla como la de relaciones del ejemplo.
Cada nombre y cada vínculo deben tener una explicación que el equipo pueda leer y justificar.

## Preguntas de comprobación

1. **Entidad, atributo y valor:** en el dato «Producto: Cemento», ¿qué representa Producto y qué
   representa Cemento? ¿Dónde se ubica su unidad de venta?  
   **Pista:** separa el tipo de cosa que se registra, la característica y su contenido concreto.
2. **Cantidad por operación:** ¿por qué no basta con guardar la cantidad solicitada como un dato
   general de Cemento?  
   **Pista:** compara los 2 sacos del pedido 1042 con los 5 sacos del pedido 1043.
3. **Relaciones:** ¿qué datos del ejemplo permiten afirmar que Pedido y Producto se relacionan
   de muchos a muchos?  
   **Pista:** revisa cuántos productos tiene un pedido y en cuántos pedidos aparece Cemento.

## Lo que tenía que aparecer en tu respuesta

| Pregunta | Respuesta | Lo que revela |
| --- | --- | --- |
| 1 · Entidad, atributo y valor | **Producto es la entidad; nombre y unidad de venta son atributos; Cemento y saco son sus valores en ese registro.** | Separar el concepto de sus valores permite describir un catálogo completo sin crear una entidad distinta para cada artículo. |
| 2 · Cantidad por operación | **Cemento tiene cantidad 2 en un pedido y 5 en otro. La cantidad pertenece a cada línea que relaciona un pedido con ese producto.** | Un dato de una relación no debe sustituir la información general de una entidad que se reutiliza. |
| 3 · Relaciones | **El pedido 1042 incluye dos productos y Cemento aparece en los pedidos 1042 y 1043.** | Para definir una relación hay que revisar ambos sentidos; observar solo un formulario con un producto puede ocultar los demás casos. |

El modelo ya distingue cliente, pedido, producto y cantidad por línea. El Bloque 4 traducirá
esas decisiones a tablas, claves y una estructura de detalle que permita guardar y recuperar
el recorrido completo.

---

# BLOQUE 4: Proponer tablas y comprobar el diseño

**Duración:** 30 minutos · 10:10 - 10:40  
**Objetivo:** representar el modelo inicial mediante tablas y claves, y comprobar con los datos
del recorrido que se pueden conservar y recuperar los pedidos completos.

## 4.1 Identificar registros y conectar tablas

En un **modelo relacional**, los datos se organizan en tablas que se conectan mediante claves.
Una **tabla** reúne registros con la misma estructura; cada **fila** es un registro y cada
**columna** representa un dato de esa estructura. Por ejemplo, Producto puede traducirse a una
tabla con columnas para su identificador, nombre y unidad de venta.

Una **clave primaria** identifica cada fila de una tabla. Su valor no se repite dentro de esa
tabla y debe estar presente. En el ejemplo, `id_cliente` identifica un cliente y `numero_pedido`
identifica un pedido. `id` significa identificador; los guiones bajos separan palabras en los
nombres de las columnas.

Una **clave foránea** guarda la referencia a un registro de otra tabla. Por ejemplo,
`pedido.id_cliente` indica a qué cliente corresponde el pedido. El punto permite leer «columna
id_cliente de la tabla pedido». La referencia debe apuntar a un cliente que exista.

Para el ejemplo se propone esta estructura:

| Tabla | Clave primaria | Otras columnas y relaciones |
| --- | --- | --- |
| `cliente` | `id_cliente` | `nombre`: nombre del cliente |
| `producto` | `id_producto` | `nombre` y `unidad_venta`: datos generales del producto |
| `pedido` | `numero_pedido` | `id_cliente`: clave foránea hacia `cliente.id_cliente`; es obligatoria porque cada pedido corresponde a un cliente |
| `detalle_pedido` | La combinación de `numero_pedido` e `id_producto` | Ambos son claves foráneas hacia Pedido y Producto, respectivamente; `cantidad` indica cuánto de ese producto se solicita en ese pedido |

La clave de `detalle_pedido` es **compuesta**: utiliza dos columnas juntas para identificar una
fila. Para esta propuesta se adopta la regla de que un producto aparece una sola vez por pedido;
si se solicita más del mismo producto, se modifica su cantidad. Esa decisión permite identificar
la línea mediante la combinación pedido y producto. Es una regla didáctica que cada equipo debe
revisar antes de adoptarla en su caso.

Un pedido puede tener muchas filas de detalle y un producto puede aparecer en los detalles de
muchos pedidos. De esta manera se representa la relación muchos a muchos, conservando la cantidad
propia de cada vínculo.

Los identificadores de este ejemplo se representan como números enteros; los nombres y las
unidades, como texto; la cantidad, como un número mayor que cero. El tipo y la precisión de las
cantidades deben corresponder a la unidad utilizada en cada proyecto.

## 4.2 Guardar los dos pedidos sin mezclar sus cantidades

Se conservan los datos ficticios de los bloques anteriores y se agregan identificadores de
ejemplo: **1** identifica a Ana Soto; **10** identifica Cemento; **20** identifica Brocha. Son
identificadores, no cantidades, precios ni posiciones obligatorias en una lista.

### Tabla cliente

| id_cliente | nombre |
| --- | --- |
| 1 | Ana Soto |

### Tabla producto

| id_producto | nombre | unidad_venta |
| --- | --- | --- |
| 10 | Cemento | saco |
| 20 | Brocha | unidad |

### Tabla pedido

| numero_pedido | id_cliente |
| --- | --- |
| 1042 | 1 |
| 1043 | 1 |

### Tabla detalle_pedido

| numero_pedido | id_producto | cantidad |
| --- | --- | --- |
| 1042 | 10 | 2 |
| 1042 | 20 | 3 |
| 1043 | 10 | 5 |

Ana Soto se registra una vez y sus dos pedidos apuntan a ese registro. Cemento también se
registra una vez, pero sus cantidades se conservan por separado: 2 en el pedido 1042 y 5 en el
1043. El pedido 1042 aparece dos veces en el detalle porque contiene dos productos distintos.

La combinación `1042, 10` identifica la línea de Cemento del primer pedido. `1043, 10` identifica
otra línea del mismo producto en otro pedido. Compartir `id_producto` no convierte esas dos
líneas en la misma fila.

Esta estructura evita reservar columnas como `producto_1`, `producto_2` y `producto_3` en Pedido.
Cada producto solicitado ocupa una fila de detalle, por lo que un pedido puede tener distintas
cantidades de líneas sin cambiar la estructura de la tabla.

## 4.3 Recuperar el resultado y revisar las reglas

Para reconstruir el pedido 1042, el sistema recorre las referencias:

1. Encuentra el pedido con `numero_pedido` 1042.
2. Lee su `id_cliente`, que vale 1, y encuentra a Ana Soto en Cliente.
3. Encuentra los detalles cuyo `numero_pedido` es 1042: productos 10 y 20, con cantidades 2 y 3.
4. Busca los nombres y unidades de esos productos y los muestra junto a cada cantidad.

El resultado esperado es:

| Número | Cliente | Producto | Cantidad | Unidad |
| --- | --- | --- | --- | --- |
| 1042 | Ana Soto | Cemento | 2 | saco |
| 1042 | Ana Soto | Brocha | 3 | unidad |

### Lectura de una consulta SQL

**SQL** es un lenguaje para definir y consultar datos en bases de datos relacionales. Una
consulta puede combinar tablas mediante sus referencias para obtener la información que necesita
la pantalla. En este ejemplo:

- `SELECT` indica qué columnas se mostrarán y `FROM` señala la tabla desde la que se consulta.
- `JOIN` combina tablas; `ON` indica qué columnas deben coincidir. El signo `=` expresa igualdad.
- `AS` asigna un nombre a una columna del resultado.
- `WHERE` limita el resultado al pedido solicitado; `ORDER BY` ordena las filas.
- El punto y coma termina la instrucción.

```sql
SELECT
    pedido.numero_pedido,
    cliente.nombre AS cliente,
    producto.nombre AS producto,
    detalle_pedido.cantidad,
    producto.unidad_venta
FROM pedido
JOIN cliente ON cliente.id_cliente = pedido.id_cliente
JOIN detalle_pedido ON detalle_pedido.numero_pedido = pedido.numero_pedido
JOIN producto ON producto.id_producto = detalle_pedido.id_producto
WHERE pedido.numero_pedido = 1042
ORDER BY producto.id_producto;
```

La consulta corresponde a la estructura y a los datos de este ejemplo. El 1042 selecciona el
pedido que se quiere recuperar. En una aplicación, ese dato se recibe desde la operación de
consulta y se utiliza como **parámetro**: un valor que se entrega a la consulta por separado de
su texto, mediante el mecanismo de acceso a datos de la tecnología elegida. No se debe construir
la instrucción pegando directamente el texto escrito por la persona.

### Qué debe impedir el sistema

| Comprobación | Comportamiento esperado |
| --- | --- |
| Dos pedidos intentan usar el mismo número | La clave primaria impide guardar dos filas con ese identificador |
| Se intenta guardar un pedido con un cliente que no existe | La clave foránea impide conservar una referencia inexistente; la operación debe informar el problema |
| Se intenta guardar dos veces la misma combinación pedido y producto | La clave compuesta impide repetir esa línea, de acuerdo con la regla propuesta |
| Una cantidad es cero, negativa o no es numérica | La operación rechaza el dato; el diseño de la base debe incluir el tipo y la restricción de cantidad positiva |
| Se intenta guardar un pedido sin productos o falla el guardado de una línea | La operación debe evitar dejar un pedido confirmado incompleto |

Las claves foráneas comprueban referencias, pero **no aseguran por sí solas que un pedido tenga
al menos una línea**. Esa condición también debe aplicarse al guardar la operación.

El pedido y sus detalles deben conservarse como un conjunto completo. Una **transacción** agrupa
los cambios para que se confirmen todos o se deshagan si alguno falla. El diseño debe contemplar
ese comportamiento; una confirmación de éxito solo corresponde cuando el conjunto se guardó.

Para comprobar el modelo, recupera también el pedido 1043: debe mostrar a Ana Soto con 5 sacos
de cemento, conservando sin cambios las cantidades del pedido 1042.

## 4.4 Aplicación al proyecto del equipo

**Trabajo sugerido: 12 minutos.** Utiliza el modelo del Bloque 3 y los dos casos ficticios:

1. Propón las tablas y sus columnas. Explica qué representa cada fila y qué datos exige la operación.
2. Identifica la clave primaria de cada tabla y las claves foráneas que conectan los registros.
   Si propones una clave compuesta, explica qué regla permite identificar la fila con esa combinación.
3. Representa los datos de tus dos casos en filas de ejemplo. Si una relación necesita guardar
   datos propios, como una cantidad, determina cómo se representará su detalle o asociación.
4. Recorre las referencias para reconstruir lo que debería mostrar la pantalla. Compara el
   resultado con los criterios de aceptación del Bloque 2.
5. Comprueba un dato inválido y señala qué regla debe impedirlo. Indica qué cambios tienen que
   guardarse juntos para evitar una operación incompleta.

| Proyecto | Comprobación que conviene realizar |
| --- | --- |
| Sistema de costos | Un mismo insumo puede utilizarse con cantidades diferentes en dos servicios, conservando cada cantidad y la unidad de consumo correspondiente |
| Órbita Digital | Se puede reconstruir una ficha y su clasificación desde sus datos; el límite de hasta tres servicios debe comprobarse expresamente al guardar, porque una clave foránea no establece ese máximo |
| CRM Yo Compro Local | Se puede recuperar el productor, el punto de venta y los productos con sus cantidades para cada entrega, sin reemplazar las cantidades de otra entrega ni introducir datos de stock o rotación |

La evidencia del trabajo es **un esquema inicial de tablas con sus claves, filas de ejemplo y
el resultado que debería recuperar la operación**. El esquema se revisa con los criterios de
aceptación; todavía puede cambiar si se modifica una regla o se aclara un supuesto.

## Preguntas de comprobación

1. **Claves y referencias:** ¿qué diferencia hay entre `cliente.id_cliente` y `pedido.id_cliente`
   aunque ambos tengan el valor 1 en el ejemplo?  
   **Pista:** identifica cuál distingue al cliente y cuál señala a quién corresponde el pedido.
2. **Detalle y cantidades:** ¿por qué Cemento aparece una sola vez en Producto, pero dos veces
   en Detalle de pedido?  
   **Pista:** compara qué describe el producto y qué describe cada solicitud de ese producto.
3. **Guardado completo:** ¿tener claves foráneas garantiza que un pedido se guardó con todos sus
   productos?  
   **Pista:** distingue comprobar que una referencia existe de confirmar la operación completa.

## Lo que tenía que aparecer en tu respuesta

| Pregunta | Respuesta | Lo que revela |
| --- | --- | --- |
| 1 · Claves y referencias | **En Cliente, el identificador es la clave primaria; en Pedido, es una clave foránea que apunta a ese cliente.** | El mismo valor puede identificar un registro en una tabla y servir como referencia desde otra. |
| 2 · Detalle y cantidades | **Producto describe el artículo reutilizable. Cada fila de detalle registra su participación y cantidad en un pedido concreto.** | La cantidad se conserva en la relación para representar operaciones distintas sin sobrescribirlas. |
| 3 · Guardado completo | **No. Las referencias deben ser válidas, pero también se exige al menos un producto y guardar el pedido con todos sus detalles como una operación completa.** | El diseño de tablas y la lógica de guardado trabajan juntos para cumplir el criterio de aceptación. |

---

# Cierre: comprobar una operación completa

**Duración:** 10 minutos · 10:40 - 10:50

El diseño inicial conecta decisiones que deben describir la misma operación:

**Necesidad → requerimientos → historia y criterios → recorrido y pantallas → datos y tablas → prueba.**

En la ferretería ficticia, la necesidad de conservar lo solicitado conduce a registrar un pedido.
La persona del mesón selecciona cliente y productos, ingresa cantidades y solicita el guardado.
El sistema valida las reglas y conserva el pedido con su detalle. La consulta del número 1042
recupera a Ana Soto, 2 sacos de cemento y 3 brochas. El segundo pedido permite comprobar que
reutilizar un producto no reemplaza las cantidades de la primera operación.

## Revisión del trabajo del equipo

Usa los materiales construidos durante el taller para recorrer un caso de tu proyecto:

| Material | Qué debe poder explicar el equipo |
| --- | --- |
| Alcance y requerimientos | Qué problema se atiende, quién utiliza la operación, qué incluye y qué queda fuera; de dónde salen sus reglas |
| Historia y criterios | Qué resultado útil se espera y cómo se reconoce el éxito o la necesidad de corregir un dato |
| Recorrido y bocetos | Qué hace la persona, qué responde el sistema y qué ocurre cuando no se puede continuar |
| Modelo y tablas | Qué información se guarda, a qué pertenece cada dato y cómo se relacionan los registros |
| Casos de comprobación | Qué datos se utilizan y qué resultado debe recuperarse, incluido el segundo caso y un dato inválido |

Si el recorrido exige un dato que el modelo no conserva, revisa el modelo. Si aparece una tabla
o una pantalla que no se puede relacionar con el alcance, revisa qué necesidad la justifica.
Si una regla sigue siendo provisional, conserva el supuesto y anota qué decisión cambiaría
cuando se confirme.

Al terminar, registra **qué parte del diseño se puede explicar y comprobar con los ejemplos y
qué falta precisar para continuar**. Ese registro permite retomar el trabajo del mismo sistema
sin perder las decisiones del equipo.

## Relación con la propuesta de proyecto

Utiliza las decisiones del taller para revisar la **delimitación del desafío** y la descripción
del **producto esperado**: deben corresponder al sistema que el equipo está diseñando. Revisa
también que los objetivos puedan vincularse con resultados que el software permita observar.

La [guía de la propuesta de proyecto](../../../guias/propuesta-de-proyecto.md) explica esas partes;
el [cronograma del módulo](../../../cronograma/README.md) indica el contenido de cada avance.
Conserva los bocetos, el modelo y las comprobaciones como evidencia del desarrollo del proyecto.
