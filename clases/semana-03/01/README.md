# Clase 06 - Semana 03 - Requerimientos, historias de usuario y estimación en Scrum

- **Unidad:** 01 · Generación de un Proyecto de Especialidad Innovador
- **Fecha:** Lunes 19 de octubre de 2026
- **Duración:** 3 horas pedagógicas · 140 minutos (08:30 - 10:50)
- **Modalidad:** Presencial · taller en equipos de proyecto
- **Docente:** Diego Obando
- **Repaso autónomo:** [Presentación de requerimientos, historias y estimación](ppt/Clase-06-Requerimientos-Historias-y-Estimacion.pptx)
- **Resumen visual:** [Infografía para capturar requerimientos como historias de usuario](infografia/infografia-requerimientos-historias-de-usuario-gptimage.png)

---

# Objetivos de la Clase

## Objetivo General

Al finalizar esta sesión, el estudiante será capaz de transformar una necesidad del proyecto en
requerimientos e historias de usuario con criterios de aceptación, estimar su tamaño relativo y
ordenarlas en un backlog inicial. Este repaso permite precisar qué debe hacer el software y cómo
comprobarlo antes de comenzar su construcción.

El recorrido utiliza un **caso ficticio para aprender el procedimiento**: una ferretería de Osorno
que recibe pedidos por WhatsApp y los anota en un cuaderno. El problema es que cuesta encontrar
los pedidos y responder al cliente sobre su estado. La persona del mesón es quien usa el sistema;
el cliente es quien compra y consulta por su pedido. «Listo para retiro» significa que todos los
productos del pedido ya están preparados.

Los números de pedido, reglas, condiciones de prueba y puntos de este ejemplo son inventados con
fines didácticos. El número 1042 identifica un pedido que existe en el ejemplo; el 9999 representa
uno que no está registrado. No son cantidades de productos. El caso no reemplaza el proyecto
asignado al equipo: cada equipo aplica el procedimiento a su propio caso, con sus fuentes y
supuestos explícitos.

## Objetivos Específicos

1. **Distinguir necesidades, requerimientos funcionales, requerimientos no funcionales y reglas
   de negocio**, expresándolos de manera concreta para delimitar lo que debe resolver el sistema.
2. **Redactar historias de usuario** que identifiquen quién necesita una capacidad, qué quiere
   conseguir y para qué, acompañadas de criterios de aceptación que permitan comprobar el resultado.
3. **Diferenciar historias de usuario y tareas técnicas**, y dividir una historia demasiado amplia
   en historias más pequeñas que conserven un resultado útil para el usuario.
4. **Estimar el tamaño relativo de las historias en equipo**, considerando esfuerzo, complejidad
   e incertidumbre, utilizando una escala de puntos y la técnica de Planning Poker.
5. **Ordenar y refinar un backlog inicial**, distinguiendo prioridad y tamaño, considerando el
   valor para el usuario y las dependencias, e identificando los detalles que faltan antes de estimar
   o desarrollar una historia.

---

# Mapa de la Clase

| Horario | Sección | Propósito |
| --- | --- | --- |
| 08:30 - 08:35 | Encuadre | Reconocer el recorrido del repaso: de una necesidad a requerimientos, historias comprobables y un backlog estimado y ordenado. |
| 08:35 - 09:00 | Bloque 1 · Requerimientos | Distinguir qué necesita el usuario, qué debe hacer el sistema, bajo qué condiciones debe funcionar y qué reglas del negocio debe respetar. Reconocer estas diferencias en la ferretería y en el proyecto del equipo. |
| 09:00 - 09:35 | Bloque 2 · Historias de usuario | Recordar la estructura «como…, quiero…, para…» y redactar criterios de aceptación observables. Diferenciar una historia de una tarea técnica y dividir historias amplias manteniendo su utilidad para el usuario. |
| 09:35 - 09:45 | Pausa | Descanso. |
| 09:45 - 10:15 | Bloque 3 · Estimación | Comparar historias por esfuerzo, complejidad e incertidumbre. Utilizar una escala de puntos como 1, 2, 3, 5 y 8 y recordar el procedimiento de Planning Poker. Distinguir puntos y horas, y reconocer cuándo falta información para estimar. |
| 10:15 - 10:40 | Bloque 4 · Backlog | Separar prioridad y tamaño. Ordenar historias considerando valor y dependencias, revisar sus criterios de aceptación y refinar las que todavía sean demasiado amplias o poco claras. |
| 10:40 - 10:50 | Cierre | Revisar la coherencia entre una necesidad, sus requerimientos y las historias propuestas. Identificar qué historias del proyecto ya se pueden estimar y cuáles necesitan aclaración o división. |

> Ten a mano la propuesta de proyecto y la información disponible del caso de tu equipo. Durante
> el taller se trabaja sobre esas mismas decisiones de alcance y funcionamiento del software.

---

# BLOQUE 1: Requerimientos

**Duración:** 25 minutos · 08:35 - 09:00  
**Objetivo:** distinguir una necesidad, los requerimientos funcionales y no funcionales que se
derivan de ella, y las reglas de negocio que debe respetar el software.

## 1.1 De la necesidad a lo que debe hacer el sistema

La ferretería recibe pedidos por WhatsApp y los anota en un cuaderno. Cuando un cliente consulta,
el mesón necesita encontrar su pedido y saber en qué estado está. Ese es el problema de trabajo
que se quiere resolver.

Una **necesidad** expresa lo que una persona necesita conseguir o mejorar. «Encontrar el pedido
y conocer su estado» permite entender para qué se construye el sistema. Todavía falta precisar
qué comportamiento del software permitirá conseguirlo.

Un **requerimiento** expresa una capacidad o condición que el sistema debe satisfacer. Por
ejemplo: «El sistema debe permitir buscar un pedido por su número y mostrar su estado actual».
Ahora se puede comprobar un resultado: ingresar el número de un pedido existente y verificar
que aparece ese pedido con su estado.

La conexión debe mantenerse: cada requerimiento tiene que ayudar a resolver una necesidad del
proyecto. Agregar funciones sin esa relación aumenta el trabajo y dificulta delimitar el sistema.

## 1.2 Funciones, condiciones de calidad y reglas de negocio

Las siguientes formulaciones son **ejemplos didácticos** de la ferretería. Sus condiciones y
valores se proponen para practicar; en el proyecto del equipo se distinguen los acuerdos del caso
de los supuestos pendientes de validación.

| Tipo | Qué expresa | Ejemplo |
| --- | --- | --- |
| Requerimiento funcional | Un resultado o comportamiento que debe proporcionar el sistema | «El sistema debe permitir registrar un pedido con sus productos y cantidades» |
| Requerimiento no funcional | Una condición de calidad o una restricción que debe cumplir la solución | «La consulta por número debe mostrar el pedido en un máximo de 2 segundos, con 1.000 pedidos almacenados, en el entorno de prueba acordado» |
| Regla de negocio | Una condición que define qué está permitido o es válido en la operación del negocio | «Un pedido solo puede entregarse cuando está listo para retiro» |

En el segundo ejemplo, **2 segundos** es el tiempo máximo desde que se solicita la búsqueda
hasta que se muestra el resultado; **1.000 pedidos** es el volumen de datos ficticios usado en la
prueba. El **entorno de prueba** es el conjunto de condiciones donde se comprueba el sistema,
incluidos equipo, aplicación y conexión. Esas condiciones deben describirse para poder repetir
la comprobación. Los valores son ilustrativos y no provienen de una medición de la organización.

Los requerimientos funcionales se refieren a comportamientos; los de calidad, a propiedades como
rendimiento o facilidad de uso. Las restricciones limitan las soluciones admisibles, por ejemplo,
tener que funcionar en los equipos disponibles. Esta distinción sigue el
[glosario de ingeniería de requerimientos de IREB](https://cpre.ireb.org/en/downloads-and-resources/glossary).

Una regla de negocio puede existir mientras el trabajo se hace en papel. La regla sobre entregar
pedidos condiciona también el software: de ella se puede derivar el requerimiento funcional
«El sistema debe impedir marcar como entregado un pedido cuyo estado no sea listo para retiro».
La regla y la función están relacionadas; describen la condición del negocio y su aplicación
en el sistema, respectivamente.

## 1.3 Escribir algo que se pueda comprobar

«Gestionar pedidos» deja abiertas muchas funciones posibles. «El sistema debe ser rápido» deja
abierto cuánto tiempo se considera aceptable. Ambas expresiones necesitan precisión.

| Formulación inicial | Qué falta precisar | Formulación que permite comprobar un resultado |
| --- | --- | --- |
| «Gestionar pedidos» | La operación concreta | «El sistema debe permitir buscar un pedido por su número y mostrar su estado actual» |
| «Que no se entreguen pedidos incompletos» | Cuándo se considera que el pedido está listo | «Un pedido está listo para retiro cuando todos sus productos están preparados»; a partir de esta regla se define la validación del cambio de estado |
| «Que sea rápido» | Tiempo y condiciones de medición | La condición de 2 segundos y 1.000 pedidos del ejemplo anterior, con el entorno de prueba descrito |

Escribir un requerimiento verificable exige indicar el comportamiento o condición esperada y
cómo reconocer su cumplimiento. También exige conservar su procedencia: información del caso,
acuerdo confirmado o supuesto del equipo. Si se propone una regla que todavía no está confirmada,
se registra como **supuesto pendiente de validación** y se continúa trabajando con esa distinción.

En Scrum, los detalles del trabajo se precisan durante el desarrollo. La
[Guía Scrum](https://scrumguides.org/scrum-guide.html#product-backlog) describe el refinamiento
como la descomposición y definición más precisa de los elementos del Product Backlog, la lista
ordenada del trabajo necesario para mejorar el producto. Aclarar requerimientos alimenta ese
proceso; no obliga a cerrar todas las especificaciones antes de empezar a construir.

## 1.4 Aplicación al proyecto del equipo

**Trabajo sugerido: 5 minutos.** Elige una necesidad del diagnóstico y redacta:

1. Un requerimiento funcional que contribuya a resolverla.
2. Una condición de calidad que permita comprobar cómo debe funcionar esa capacidad.
3. Una regla de negocio relacionada, si el caso la necesita.

Junto a cada formulación, indica de dónde sale y qué resultado permitiría comprobarla. Marca como
supuesto lo que el equipo proponga sin confirmación y concreta las frases que todavía admitan
interpretaciones distintas. La evidencia del trabajo es ese conjunto breve de formulaciones
relacionadas con la necesidad del proyecto.

## Preguntas de comprobación

1. **Necesidad y función:** ¿qué diferencia hay entre «encontrar el pedido y conocer su estado»
   y «buscar por número y mostrar el estado actual»?  
   **Pista:** identifica qué expresa el problema de la persona y qué describe una respuesta del sistema.
2. **Condición de calidad:** ¿por qué «el sistema debe ser rápido» necesita más detalle?  
   **Pista:** piensa qué medirías y qué condiciones tendrían que repetirse al comprobarlo.
3. **Regla y función:** ¿cómo se relacionan «entregar solo pedidos listos» e «impedir marcar
   como entregado un pedido que no está listo»?  
   **Pista:** distingue la condición del negocio del comportamiento que la hace cumplir en el software.

## Lo que tenía que aparecer en tu respuesta

| Pregunta | Respuesta | Lo que revela |
| --- | --- | --- |
| 1 · Necesidad y función | **La necesidad explica lo que la persona busca conseguir; el requerimiento funcional concreta qué debe hacer el sistema para ayudarla.** | Una misma necesidad puede requerir varias funciones, pero cada función debe tener un propósito reconocible. |
| 2 · Condición de calidad | **Faltan un límite medible y las condiciones de la prueba, como el volumen de pedidos y el entorno.** | Un adjetivo permite interpretaciones distintas; una condición verificable permite contrastar resultados. |
| 3 · Regla y función | **La regla define cuándo se permite entregar; la función impide que el sistema acepte una entrega que incumple esa condición.** | Una regla del negocio puede originar una validación funcional; las dos descripciones se complementan. |

El siguiente paso es expresar capacidades útiles desde la perspectiva de quien usa el sistema.
En el Bloque 2, estos requerimientos se relacionan con historias de usuario y criterios de aceptación.

---

# BLOQUE 2: Historias de usuario

**Duración:** 35 minutos · 09:00 - 09:35  
**Objetivo:** redactar historias que expresen una capacidad útil para un usuario, definir cómo
comprobarlas y dividir las que abarcan demasiado trabajo.

## 2.1 Del requerimiento a la perspectiva del usuario

En la ferretería se identificó este requerimiento: «El sistema debe permitir buscar un pedido
por su número y mostrar su estado actual». Quien utiliza esa capacidad es la persona que atiende
en el mesón. Su propósito es responder a un cliente que consulta por un pedido.

Una **historia de usuario** describe brevemente una capacidad desde la perspectiva de quien la
necesita y expresa el valor que espera obtener. Una forma de redactarla es:

> Como **persona que atiende en el mesón**, quiero **consultar un pedido por su número** para
> **informar al cliente en qué estado se encuentra**.

| Parte | Qué aporta | En la historia de la ferretería |
| --- | --- | --- |
| Como… | Identifica el tipo de usuario o rol que necesita la capacidad | Persona que atiende en el mesón |
| Quiero… | Expresa qué necesita poder hacer | Consultar un pedido por su número |
| Para… | Explica el beneficio o propósito | Informar al cliente sobre el estado de su pedido |

Nombrar al usuario con precisión ayuda a comprender su trabajo. «Como usuario» deja abierto si
se trata del cliente, la persona del mesón o quien prepara los pedidos. El propósito también
orienta las decisiones: consultar un estado para responder al cliente requiere información distinta
de la necesaria para decidir qué productos comprar a un proveedor.

La historia se completa al aclarar sus detalles y acordar cómo comprobarla. La formulación de
[tarjeta, conversación y confirmación de Agile Alliance](https://agilealliance.org/glossary/three-cs/)
recuerda esas tres partes: una descripción breve, la comprensión compartida de lo que se necesita
y las condiciones que permiten verificar el resultado. En el proyecto del equipo, los detalles
que todavía sean supuestos deben conservar esa identificación.

## 2.2 Criterios de aceptación: qué resultado se espera

Un **criterio de aceptación** describe una condición observable que debe satisfacer una historia
para responder a la necesidad planteada. Ayuda a precisar el alcance y a preparar las pruebas.

Para la historia de consulta, se proponen tres criterios didácticos:

1. Al buscar un número de pedido existente, se muestran su número y su estado actual.
2. Al buscar un número que no existe, se informa que no se encontró el pedido.
3. Si el campo está vacío, se solicita ingresar el número antes de ejecutar la búsqueda.

Los tres criterios describen resultados que se pueden observar. «Que funcione bien» todavía
necesita precisión; «crear una tabla de pedidos» describe una decisión técnica del desarrollo.

Una manera de escribir cada caso es **Dado / Cuando / Entonces**:

| Parte | Qué describe | Ejemplo de consulta |
| --- | --- | --- |
| Dado | El contexto inicial que permite ejecutar el caso | Existe un pedido cuyo estado es «Listo para retiro» |
| Cuando | La acción o el evento que ocurre | La persona del mesón busca ese pedido por su número |
| Entonces | El resultado observable esperado | Se muestran el número del pedido y el estado «Listo para retiro» |

Esta estructura, descrita por [Agile Alliance](https://agilealliance.org/glossary/given-when-then/),
permite conectar una condición inicial, una acción y sus consecuencias. Puede escribirse en
lenguaje natural; no requiere una herramienta de pruebas específica.

Un caso exitoso permite comprobar un recorrido. Los casos de número inexistente y campo vacío
aclaran qué debe ocurrir cuando la consulta no puede entregar un pedido. Las condiciones de calidad
también se mantienen: el límite de respuesta del Bloque 1 se comprueba sobre esta consulta bajo
las condiciones definidas para la prueba.

Estos criterios corresponden a la historia de consulta. Su cumplimiento se revisa junto con los
acuerdos generales de calidad del equipo, como que el cambio esté integrado y probado.

## 2.3 Historia de usuario y tareas técnicas

Para que la persona del mesón pueda consultar un pedido, el equipo necesita realizar trabajo
de implementación. Una **tarea técnica** describe una parte de ese trabajo.

| Elemento | Ejemplo | Qué permite revisar |
| --- | --- | --- |
| Historia de usuario | Consultar un pedido por su número para informar su estado al cliente | Si la persona puede conseguir el resultado esperado |
| Tarea técnica | Implementar la búsqueda del pedido en la base de datos | Si está implementada esa parte del acceso a los datos |
| Tarea técnica | Construir el campo de búsqueda y la visualización del resultado | Si está construida esa parte de la interfaz |
| Tarea técnica | Probar números existentes, inexistentes y entradas vacías | Si los casos definidos producen los resultados esperados |

La historia puede necesitar todas esas tareas. Terminar una consulta a la base de datos, por sí
solo, todavía no permite que la persona del mesón use la capacidad completa. El resultado de la
historia se comprueba recorriendo el funcionamiento integrado.

Escribir «Como programador, quiero crear una tabla» sigue describiendo trabajo técnico. La
plantilla «como…, quiero…, para…» ayuda a redactar, pero el valor de una historia depende de la
capacidad que aporta a quien necesita el producto.

## 2.4 Dividir una historia demasiado amplia

«Como persona del mesón, quiero gestionar los pedidos para atender a los clientes» reúne varias
capacidades y deja abierto qué significa gestionar. Se puede dividir por resultados útiles:

| Historia más pequeña | Resultado que se puede mostrar |
| --- | --- |
| Como persona del mesón, quiero registrar los productos y cantidades de un pedido para conservar lo solicitado por el cliente | Crear un pedido y comprobar que quedó guardado con sus productos y cantidades |
| Como persona del mesón, quiero consultar un pedido por su número para informar al cliente sobre su estado | Encontrar un pedido existente y mostrar su estado actual |
| Como persona del mesón, quiero marcar un pedido preparado como listo para retiro para identificar cuáles se pueden entregar | Cambiar el estado de un pedido preparado y comprobar que la consulta muestra el nuevo estado |

Cada historia conserva un resultado comprobable. Puede requerir cambios en la interfaz, la lógica
del sistema y el almacenamiento de datos. Dividir en «hacer pantalla», «hacer base de datos» y
«conectar ambas» produce tareas técnicas de una capacidad; para dividir historias se buscan
resultados útiles más pequeños. Este criterio está desarrollado en la guía de
[división de historias de Mountain Goat Software](https://www.mountaingoatsoftware.com/agile/user-stories/story-splitting).

Las historias pueden tener dependencias: para consultar un pedido tiene que existir uno, y
para marcarlo listo debe estar preparado. Reconocer esas relaciones ayuda a ordenar el trabajo.
En esta versión, «marcar listo» registra una preparación ya realizada; no incorpora por sí sola
un seguimiento detallado de cada producto ni una notificación automática al cliente.

## 2.5 Aplicación al proyecto del equipo

**Trabajo sugerido: 7 minutos.** A partir de un requerimiento funcional del Bloque 1:

1. Redacta dos historias que identifiquen usuario, capacidad y propósito.
2. Para cada historia, escribe un criterio para el recorrido exitoso y otro para una situación
   alternativa relevante, como un dato faltante o una búsqueda sin resultados. Desarrolla al
   menos uno con Dado / Cuando / Entonces.
3. Identifica dos tareas técnicas que contribuirían a implementar cada historia.
4. Si una historia reúne varias capacidades, propón una división que permita mostrar un resultado
   útil en cada parte. Conserva como pendientes los detalles que todavía no se conocen.

La evidencia del trabajo son dos historias con criterios verificables y tareas relacionadas,
o una propuesta de división si una historia original abarcaba demasiado.

## Preguntas de comprobación

1. **Usuario y valor:** ¿qué información aporta «para informar al cliente en qué estado está su
   pedido» a la historia de consulta?  
   **Pista:** relaciona la búsqueda con la situación de trabajo de la persona del mesón.
2. **Aceptación y tarea:** ¿qué diferencia hay entre «mostrar el estado del pedido encontrado»
   y «implementar la consulta a la base de datos»?  
   **Pista:** identifica cuál permite observar un resultado útil y cuál describe trabajo de implementación.
3. **División de historias:** ¿por qué «registrar un pedido» y «consultar un pedido» sirven para
   dividir «gestionar pedidos», mientras «hacer pantalla» y «hacer base de datos» son tareas?  
   **Pista:** revisa qué puede conseguir el usuario cuando se completa cada parte.

## Lo que tenía que aparecer en tu respuesta

| Pregunta | Respuesta | Lo que revela |
| --- | --- | --- |
| 1 · Usuario y valor | **Explica para qué necesita la consulta: responder al cliente con el estado de su pedido.** | El propósito permite evaluar si la capacidad propuesta resuelve la necesidad o requiere ajustes. |
| 2 · Aceptación y tarea | **El criterio describe un resultado observable de la historia; la tarea describe trabajo necesario para implementarlo.** | Completar tareas no demuestra por sí solo que la capacidad integrada satisface sus criterios. |
| 3 · División de historias | **Registrar y consultar son capacidades con resultados útiles propios; pantalla y base de datos son partes técnicas de su implementación.** | Una división útil reduce el alcance de cada historia y conserva algo que se puede comprobar desde el uso del sistema. |

Con la capacidad y sus criterios más claros, el equipo puede discutir cuánto trabajo relativo
representa. El Bloque 3 aborda esa estimación y qué hacer cuando todavía hay demasiada incertidumbre.

---

# BLOQUE 3: Estimación

**Duración:** 30 minutos · 09:45 - 10:15  
**Objetivo:** comparar el tamaño de las historias, estimarlas en equipo mediante puntos y
Planning Poker, e identificar cuándo es necesario aclarar o dividir una historia antes de estimarla.

## 3.1 Qué se estima en una historia

La ferretería necesita registrar pedidos, consultarlos y marcar los preparados como listos para
retiro. Aunque las tres capacidades se describan en una frase, pueden representar cantidades de
trabajo diferentes.

**Estimar** es valorar aproximadamente el trabajo necesario para completar una historia con sus
criterios de aceptación. La comparación considera:

| Aspecto | Qué se examina | En la ferretería |
| --- | --- | --- |
| Cantidad de trabajo | Cuánto hay que implementar, integrar y probar | Registrar productos y cantidades requiere más entradas y validaciones que buscar por un número |
| Complejidad | Qué tan difíciles son las reglas o relaciones que intervienen | Cambiar a «Listo para retiro» exige respetar las condiciones acordadas sobre la preparación |
| Incertidumbre y riesgo | Qué falta conocer y qué podría aumentar el esfuerzo | Si el equipo desconoce cómo se confirma la preparación, todavía puede estar suponiendo comportamientos distintos |

El esfuerzo incluye el trabajo necesario para obtener una capacidad integrada y probada.
Considerar solamente la pantalla o solamente la programación deja fuera partes que también hacen
falta para cumplir la historia. Esta comparación se desarrolla en la guía de
[puntos de historia de Mountain Goat Software](https://www.mountaingoatsoftware.com/agile/story-points).

En Scrum, quienes realizarán el trabajo son responsables de dimensionarlo, según la
[Guía Scrum](https://scrumguides.org/scrum-guide.html#product-backlog). Los puntos y Planning Poker
son técnicas que se pueden utilizar para esa estimación; no son formatos obligatorios de Scrum.

## 3.2 Puntos y una historia de referencia

Los **puntos de historia** expresan tamaño relativo: permiten comparar una historia con otras
que el mismo equipo comprende. La referencia es una historia concreta con alcance y criterios
conocidos.

Para este ejemplo didáctico, el equipo toma «consultar un pedido por su número» como referencia
y le asigna **2 puntos**. Es una decisión ilustrativa para practicar la comparación, no una
estimación realizada por los estudiantes ni un valor universal para esa función.

Se utilizará una escala de **1, 2, 3, 5 y 8 puntos**, basada en la sucesión de Fibonacci: después
de 1 y 2, cada valor se obtiene sumando los dos anteriores. Los saltos entre valores ayudan a
trabajar con aproximaciones, evitando discutir diferencias pequeñas que el equipo no puede
justificar con la información disponible.

| Historia | Estimación ilustrativa | Razón de la comparación |
| --- | --- | --- |
| Consultar un pedido por su número | 2 puntos · referencia | Incluye búsqueda, visualización y los casos de número existente, inexistente y campo vacío del Bloque 2 |
| Marcar un pedido preparado como listo para retiro | 3 puntos | En este ejemplo, agrega un cambio persistente de estado y la validación de cuándo se permite realizarlo |
| Registrar productos y cantidades de un pedido | 5 puntos | Incluye varias entradas, validaciones y guardado de los datos relacionados |

Las cifras tienen sentido junto con esas razones y el contexto del equipo. Si cambia el alcance,
la experiencia o lo que ya está construido, la comparación puede cambiar. Una estimación de
5 puntos expresa una historia mayor que la referencia de 2; no permite afirmar cuántas horas
demorará ni fijar una fecha de entrega.

La guía para [introducir puntos en un equipo](https://www.mountaingoatsoftware.com/agile/story-points/introducing-story-points-to-a-team)
explica esta comparación relativa. Los puntos no tienen una conversión fija a horas y los totales
de equipos diferentes no son una medida común de productividad. Tampoco indican prioridad:
una historia pequeña puede ser urgente y una historia grande puede esperar.

## 3.3 Planning Poker: estimar y explicar diferencias

**Planning Poker** es una técnica de estimación en la que cada participante elige un valor en
privado y todos lo muestran al mismo tiempo. Las diferencias se utilizan para aclarar el trabajo.

El procedimiento, descrito por [Mountain Goat Software](https://www.mountaingoatsoftware.com/agile/story-points/planning-poker),
se puede practicar con tarjetas de papel:

1. **Revisar la historia:** leer su propósito, criterios de aceptación y supuestos. Aclarar qué
   incluye y qué queda fuera antes de elegir un valor.
2. **Comparar con la referencia:** considerar el trabajo completo y las condiciones de las historias
   ya entendidas por el equipo.
3. **Elegir en privado:** cada participante selecciona un valor de la escala y lo mantiene oculto.
4. **Mostrar a la vez:** revelar las estimaciones simultáneamente para que la primera opinión
   expresada no condicione las demás.
5. **Explicar las diferencias:** quienes eligieron valores más bajos y más altos explican qué
   trabajo, condiciones o riesgos consideraron. El equipo revisa si todos entendieron la misma historia.
6. **Volver a estimar y registrar:** tras aclarar las diferencias, repetir la elección y acordar
   una estimación con sus supuestos. Si sigue faltando información decisiva, registrar el pendiente
   y refinar la historia antes de continuar.

### Ejemplo de una diferencia útil

Para «marcar un pedido preparado como listo para retiro», tres participantes muestran **2, 3 y
8 puntos**. Son votos ficticios de una ronda para ilustrar el procedimiento.

- Quien eligió 2 considera un cambio de estado sobre un pedido que ya está preparado.
- Quien eligió 3 incluye comprobar la condición del cambio y probar los estados no permitidos.
- Quien eligió 8 está suponiendo además seguimiento de cada producto y una notificación automática.

El Bloque 2 había delimitado esa historia al registro de una preparación ya realizada. Revisar
esa delimitación permite separar las funciones adicionales que una persona estaba incluyendo.
Se vuelve a estimar la misma historia con una comprensión compartida; los números por sí solos
no resuelven la diferencia.

Para cerrar este **ejemplo ficticio**, se supone que en la nueva votación el equipo acuerda
**3 puntos**, incluyendo guardar el nuevo estado y comprobar la preparación del pedido. El aviso
automático y el seguimiento por producto quedan fuera de esa historia. Este cierre ilustra un
acuerdo razonado; otro equipo puede estimar un valor diferente si lo justifica con su referencia.

El [promedio de los votos](https://www.mountaingoatsoftware.com/agile/dont-average-during-planning-poker)
ocultaría esas interpretaciones. Tampoco se adopta automáticamente el voto más alto ni se sigue
a quien tiene más experiencia: se explican las razones y se revisa el alcance.

## 3.4 Cuando todavía no se puede estimar

Una historia amplia como «gestionar todos los pedidos» necesita dividirse en capacidades más
pequeñas. Una historia con una regla desconocida necesita aclarar esa regla. Son problemas que
requieren acciones distintas.

| Situación | Acción antes de continuar |
| --- | --- |
| La historia reúne varias capacidades que podrían entregarse por separado | Dividirla conservando resultados útiles, como se practicó en el Bloque 2 |
| Los criterios permiten interpretaciones distintas | Precisar casos y resultados esperados |
| Se desconoce si una solución técnica es viable | Hacer una investigación o prueba acotada y registrar lo aprendido |
| Falta confirmar un dato del caso | Registrar el supuesto y qué decisión depende de él; estimar bajo ese supuesto solo si el equipo comprende sus consecuencias |

Agregar puntos no reemplaza la información que falta. Un valor de 8 tampoco obliga por sí solo
a dividir: el equipo revisa si la historia es manejable y está suficientemente clara. Si no hay
base para comparar, se deja **pendiente de estimación**, junto con el motivo y la acción para resolverlo.

## 3.5 Aplicación al proyecto del equipo

**Trabajo sugerido: 7 minutos.** Usa las historias y criterios preparados en el Bloque 2.

1. Elige una historia clara como referencia y acuerda un valor de la escala.
2. Compara otra historia mediante una ronda de Planning Poker. Cada integrante elige antes de ver
   las estimaciones de los demás.
3. Explica las diferencias, revisa el alcance y repite la estimación si hace falta.
4. Registra historia, puntos y una razón de la comparación. Si no se puede estimar, escribe qué
   falta aclarar o dividir y deja el valor pendiente.

La evidencia del trabajo es una estimación razonada respecto de una referencia, o un pendiente
concreto que el equipo necesita resolver. La actividad puede realizarse con papel; no requiere
una aplicación ni una cuenta en una plataforma.

## Preguntas de comprobación

1. **Tamaño relativo:** si consultar un pedido tiene 2 puntos y registrar uno tiene 5,
   ¿qué se puede concluir y qué falta para hablar de una fecha de entrega?  
   **Pista:** distingue la comparación entre historias de la duración del trabajo en un calendario.
2. **Diferencias de estimación:** ¿qué debería hacer el equipo ante votos de 2, 3 y 8 puntos
   para «marcar listo para retiro»?  
   **Pista:** recuerda qué funciones había incluido cada participante en el ejemplo.
3. **Información insuficiente:** ¿qué corresponde registrar cuando la historia depende de una
   regla que el equipo todavía no comprende?  
   **Pista:** identifica qué permitiría sustituir la incertidumbre por una comparación razonada.

## Lo que tenía que aparecer en tu respuesta

| Pregunta | Respuesta | Lo que revela |
| --- | --- | --- |
| 1 · Tamaño relativo | **El equipo considera mayor la historia de registro. Los puntos por sí solos no fijan una duración ni una fecha; falta considerar la capacidad disponible y la experiencia real de ejecución.** | Comparar tamaño ayuda a planificar, pero convertir puntos directamente en horas produce una precisión que la estimación no ofrece. |
| 2 · Diferencias de estimación | **Explicar las razones, comprobar el alcance y volver a estimar con la misma comprensión de la historia.** | Una diferencia grande puede revelar funciones añadidas o trabajo omitido, además de distintas percepciones del esfuerzo. |
| 3 · Información insuficiente | **Dejar la historia pendiente de estimación y registrar la regla que falta aclarar y la acción para resolverla.** | El resultado útil de la estimación también puede ser descubrir qué impide estimar con fundamento. |

Conocer el tamaño permite comparar el trabajo que implican las historias. El Bloque 4 incorpora
su valor y sus dependencias para decidir el orden del backlog.

---

# BLOQUE 4: Backlog

**Duración:** 25 minutos · 10:15 - 10:40  
**Objetivo:** ordenar las historias por el valor que aportan y sus dependencias, utilizando las
estimaciones como información de apoyo y refinando las que todavía necesitan mayor claridad.

## 4.1 Una lista ordenada para orientar el desarrollo

Después de describir y estimar las historias, queda una decisión: por dónde comenzar.
En la ferretería, consultar un pedido tiene sentido cuando existe un registro del pedido que
se pueda encontrar. Elegir únicamente la historia con menos puntos dejaría fuera esa relación.

El **Product Backlog**, o backlog del producto, es la lista ordenada y evolutiva del trabajo
necesario para mejorar el producto. Puede incluir historias de usuario, correcciones, mejoras
de calidad y trabajo de investigación. En este taller se comienza ordenando las historias ya
redactadas para el software del equipo.

La [Guía Scrum](https://scrumguides.org/scrum-guide.html#product-backlog) establece que el
**Product Owner** es responsable de maximizar el valor del producto y de la gestión efectiva
del backlog, incluida su ordenación. Quienes desarrollan aportan información sobre tamaño,
dependencias y viabilidad. El orden se revisa a medida que se aprende del producto y de sus usuarios.

## 4.2 Prioridad y tamaño responden decisiones distintas

La **prioridad** expresa qué conviene abordar antes para avanzar hacia el propósito del producto.
El **tamaño** expresa el esfuerzo relativo estimado para completar el trabajo. Ambos datos ayudan
a decidir, pero cumplen funciones diferentes.

| Información | Qué permite considerar | En la ferretería |
| --- | --- | --- |
| Valor para el usuario | Qué problema ayuda a resolver y qué beneficio produce | Registrar el pedido permite conservar lo que solicitó el cliente |
| Urgencia | Qué consecuencia tiene postergar la capacidad | Si siguen perdiéndose pedidos, disponer de un registro puede ser más urgente que agregar un reporte |
| Dependencia | Qué dato o capacidad necesita existir para que otra pueda utilizarse | Consultar por número necesita un pedido registrado e identificado |
| Tamaño | Cuánto trabajo representa respecto de la referencia del equipo | Registrar tiene 5 puntos y consultar tiene 2 en el ejemplo didáctico |
| Incertidumbre | Qué falta conocer y podría cambiar la decisión | Una regla de preparación sin aclarar puede requerir trabajo de refinamiento antes del desarrollo |

Una historia de 2 puntos puede ir después de una de 5 si necesita su resultado. Dos historias
de igual tamaño también pueden tener prioridades distintas. El orden se justifica por el
objetivo y las condiciones del producto; no se obtiene ordenando los puntos de menor a mayor.
Estos factores se desarrollan en la guía de
[priorización del backlog de Mountain Goat Software](https://www.mountaingoatsoftware.com/agile/product-backlog/how-to-prioritize-a-product-backlog).

## 4.3 El backlog inicial de la ferretería

Para el ejemplo se busca una primera versión que permita **registrar y seguir pedidos**.
Las tres historias y sus puntos se conservan de los bloques anteriores:

| Orden propuesto | Historia, en forma abreviada | Puntos ilustrativos | Razón del orden y condición relevante |
| --- | --- | --- | --- |
| 1 | Registrar los productos y cantidades de un pedido | 5 | Permite conservar lo solicitado y generar los datos que se consultarán después |
| 2 | Consultar un pedido por su número | 2 | Permite encontrar lo registrado e informar su estado al cliente; necesita pedidos existentes |
| 3 | Marcar un pedido preparado como listo para retiro | 3 | Incorpora una actualización del estado que luego debe verse al consultar; falta confirmar la preparación fuera de esta historia |

El orden de la tabla es una propuesta para este ejemplo. La dependencia de datos puede resolverse
con pedidos ficticios durante el desarrollo y las pruebas; no obliga a construir todas las partes
en una secuencia técnica rígida. Para usar el conjunto con pedidos reales, el registro, la consulta
y los cambios de estado deben funcionar de manera coherente.

Los títulos abreviados facilitan leer el backlog. Cada elemento conserva su historia completa,
criterios de aceptación, estimación y supuestos. Las funciones que queden fuera de esta primera
versión se mantienen diferenciadas para poder discutirlas más adelante.

## 4.4 Refinar antes de comprometer trabajo

**Refinar** es mejorar la comprensión y precisión de los elementos del backlog: aclarar detalles,
dividir los demasiado amplios, revisar criterios, estimar y actualizar el orden cuando corresponda.
Es una actividad continua. Los elementos más próximos al desarrollo necesitan suficiente detalle
para que el equipo pueda comprenderlos y trabajar sobre ellos. La guía de
[refinamiento y mantenimiento del backlog](https://www.mountaingoatsoftware.com/agile/product-backlog)
describe esa preparación progresiva.

Antes de elegir una historia para desarrollar, revisa:

- **Propósito:** se identifica quién necesita la capacidad y qué resultado espera conseguir.
- **Comprobación:** sus criterios permiten reconocer el funcionamiento esperado, incluidos los
  casos relevantes que no siguen el recorrido exitoso.
- **Alcance:** se entiende qué incluye y qué queda fuera; las propuestas aún no confirmadas están
  identificadas como supuestos.
- **Tamaño y dependencias:** la historia es manejable y se conoce qué necesita de otros elementos.
  Si no se puede estimar, está registrado el motivo y cómo resolverlo.

Por ejemplo, «marcar un pedido como listo» necesita conservar la condición de que el pedido ya
está preparado. Si se agrega una notificación automática, cambian el alcance, los criterios y
posiblemente la estimación. Refinar permite hacer visible ese cambio antes de asumir que forma
parte de los mismos 3 puntos del ejemplo.

El backlog puede contener elementos todavía pendientes de aclaración. Reconocerlos permite
continuar con las capacidades suficientemente comprendidas mientras se resuelve lo que falta.

## 4.5 Aplicación al proyecto del equipo

**Trabajo sugerido: 7 minutos.** Reúne las historias, criterios y estimaciones elaborados durante
la sesión y ordénalos en una tabla sencilla:

| Orden propuesto | Historia | Puntos o pendiente | Dependencias o supuestos | Razón de la prioridad |
| --- | --- | --- | --- | --- |
| 1 | Completar con una historia del proyecto | Completar | Completar cuando corresponda | Completar |
| 2 | Completar con otra historia del proyecto | Completar | Completar cuando corresponda | Completar |

La columna «orden» expresa la propuesta de prioridad; los puntos se mantienen en su propia
columna. Si una historia depende de otra, explica la relación. Si tiene detalles sin resolver,
indica qué falta aclarar, dividir o comprobar. Revisa si la primera historia del orden realmente
ayuda a resolver la necesidad del diagnóstico y permite obtener un resultado útil.

La evidencia del trabajo es el backlog inicial con un orden justificado y sus pendientes de
refinamiento. Se puede trabajar en una tabla de texto o una planilla; no se exige una plataforma.

## Preguntas de comprobación

1. **Prioridad y tamaño:** ¿por qué registrar un pedido puede ir antes que consultarlo,
   aunque el registro tenga 5 puntos y la consulta tenga 2?  
   **Pista:** relaciona el problema de perder pedidos con los datos que necesita la consulta.
2. **Información del backlog:** ¿qué se perdería si se conservaran solo el título y los puntos
   de cada historia?  
   **Pista:** recuerda qué permitió distinguir las estimaciones de «marcar listo» en el Bloque 3.
3. **Refinamiento:** si a «marcar listo» se agrega una notificación automática, ¿qué necesita
   revisar el equipo antes de mantener su estimación y su lugar en el backlog?  
   **Pista:** identifica qué cambió en el resultado esperado y qué trabajo nuevo puede aparecer.

## Lo que tenía que aparecer en tu respuesta

| Pregunta | Respuesta | Lo que revela |
| --- | --- | --- |
| 1 · Prioridad y tamaño | **El registro conserva el pedido y aporta los datos necesarios para consultarlo. El tamaño ayuda a decidir, pero no determina por sí solo la prioridad.** | Una capacidad de mayor tamaño puede habilitar resultados que otras historias necesitan. |
| 2 · Información del backlog | **Se perderían el propósito, los criterios, las dependencias y los supuestos que explican el trabajo incluido.** | Un título y un número no permiten reconocer si el equipo sigue estimando y construyendo la misma capacidad. |
| 3 · Refinamiento | **Hay que revisar alcance, criterios, dependencias, tamaño y prioridad, y decidir si la notificación merece una historia separada.** | Una modificación del producto puede cambiar varias decisiones del backlog; el orden y la estimación se revisan con lo aprendido. |

---

# Cierre

**Duración:** 10 minutos · 10:40 - 10:50

La sesión recorrió una misma decisión de desarrollo desde distintas perspectivas. En la ferretería,
la necesidad de encontrar pedidos y conocer su estado permitió concretar un requerimiento,
expresar una historia, definir cómo comprobarla y comparar su trabajo con otras capacidades.
El backlog reúne esas decisiones y propone un orden para construir el software.

| Paso | Qué debe quedar claro | Evidencia en el trabajo del equipo |
| --- | --- | --- |
| Necesidad y requerimientos | Qué problema se aborda, qué debe hacer el sistema y qué condiciones debe cumplir | Formulaciones relacionadas con el diagnóstico, con sus acuerdos y supuestos diferenciados |
| Historias y aceptación | Quién necesita cada capacidad, para qué y qué resultados permiten comprobarla | Historias con criterios de aceptación y tareas técnicas relacionadas |
| Estimación | Qué tamaño tiene el trabajo respecto de una referencia comprendida por el equipo | Puntos con una justificación, o un pendiente concreto que impide estimar |
| Backlog | Qué conviene abordar primero y qué necesita aclaración | Historias ordenadas con razones de prioridad, dependencias y pendientes |

## Revisión del trabajo de la sesión

Elige una historia del backlog y recorre su conexión con la propuesta del proyecto:

1. Identifica la necesidad del diagnóstico a la que responde.
2. Explica qué incluye la historia y qué resultado permite comprobar que funciona.
3. Justifica su estimación respecto de la referencia del equipo, o señala lo que falta para estimarla.
4. Explica su lugar en el backlog considerando valor y dependencias.

Si no puedes sostener una de esas conexiones, revisa la formulación o registra el pendiente.
Conserva los acuerdos del equipo para actualizar la delimitación y el producto esperado de la
propuesta: lo que se escribe debe corresponder con el software que se pretende construir.
El [mapa del módulo](../../../guias/mapa-del-modulo.md) reúne el contenido del avance 2.

Una historia clara permite compartir el resultado esperado; una estimación razonada ayuda a
comparar trabajo; un backlog ordenado orienta qué abordar primero. Estas decisiones se revisan
a medida que el equipo aprende y comprueba el funcionamiento de su producto.
