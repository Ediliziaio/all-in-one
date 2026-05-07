export type BlockType = "h2" | "h3" | "p" | "ul" | "ol" | "callout" | "highlight";

export interface Block {
  type: BlockType;
  content?: string;
  items?: string[];
  emoji?: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  image: string;
  imageAlt: string;
  blocks: Block[];
}

export const articles: BlogArticle[] = [
  {
    slug: "come-trovare-stanza-padova-studenti",
    title: "Come trovare una stanza a Padova da studente universitario: guida completa 2026",
    seoTitle: "Come Trovare Stanza a Padova da Studente 2026 — Guida Completa",
    seoDescription:
      "Guida completa per trovare stanza a Padova come studente universitario: dove cercare, prezzi reali (€300–€550/mese), documenti necessari, come evitare truffe e perché lo studentato conviene.",
    excerpt:
      "Cercare casa a Padova come studente è stressante. Questa guida ti spiega passo dopo passo dove cercare, quanto spendere, i documenti che ti servono e come evitare le truffe.",
    category: "Guida Pratica",
    date: "2026-09-01",
    readTime: 8,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630&fit=crop",
    imageAlt: "Studente cerca casa a Padova con laptop",
    blocks: [
      {
        type: "p",
        content:
          "Ogni anno migliaia di studenti provenienti da tutta Italia e dall'estero si iscrivono all'Università di Padova — una delle più antiche e prestigiose d'Europa. E ogni anno si ripete la stessa corsa frenetica: trovare una stanza in tempo prima dell'inizio delle lezioni. Se stai leggendo questa guida, probabilmente sei tra loro. Niente panico: ecco tutto quello che devi sapere per trovare la soluzione giusta senza stress.",
      },
      {
        type: "h2",
        content: "Quando iniziare a cercare una stanza a Padova",
      },
      {
        type: "p",
        content:
          "La risposta breve è: prima possibile. L'offerta abitativa a Padova è alta ma la domanda lo è ancora di più. Le stanze migliori — quelle in centro, vicine all'università, con prezzi ragionevoli — vengono prenotate con mesi di anticipo. Se inizi la ricerca a luglio per settembre, potresti già trovare poca scelta.",
      },
      {
        type: "ul",
        items: [
          "Per settembre: inizia a cercare da marzo-aprile",
          "Per febbraio: inizia la ricerca da ottobre-novembre",
          "Per trasferimenti urgenti: valuta subito lo studentato, che ha disponibilità più flessibile",
        ],
      },
      {
        type: "callout",
        emoji: "⚡",
        content:
          "Consiglio: non aspettare l'esito del test di ammissione per iniziare a cercare. Se non entri in quel corso, il deposito per una stanza si perde. Molti studentati, invece, offrono cancellazione gratuita fino a una certa data.",
      },
      {
        type: "h2",
        content: "Dove cercare una stanza a Padova: le fonti più affidabili",
      },
      {
        type: "p",
        content:
          "Non tutte le fonti di ricerca sono uguali. Alcune ti faranno perdere tempo, altre sono trappole. Ecco dove conviene guardare e con quali aspettative.",
      },
      {
        type: "h3",
        content: "Portali immobiliari (Idealista, Immobiliare.it, Subito.it)",
      },
      {
        type: "p",
        content:
          "I portali immobiliari classici hanno la più grande offerta numerica, ma sono anche quelli dove si concentrano le truffe e gli annunci obsoleti. Usa sempre la funzione 'data di pubblicazione' per filtrare gli annunci recenti. Non mandare mai soldi prima di aver visto la stanza di persona o in video.",
      },
      {
        type: "h3",
        content: "Gruppi Facebook e Telegram degli studenti di Padova",
      },
      {
        type: "p",
        content:
          "I gruppi come 'Stanze Padova studenti' o i canali Telegram delle singole facoltà sono spesso il posto più aggiornato e informale per trovare stanze. Qui trovi annunci di altri studenti che lasciano la loro stanza, quindi il passaggio è diretto senza agenzia.",
      },
      {
        type: "h3",
        content: "Bacheche dell'università e portali ESU",
      },
      {
        type: "p",
        content:
          "L'Università di Padova e l'ESU (Ente per il Diritto allo Studio Universitario del Veneto) gestiscono servizi abitativi dedicati agli studenti. Le case dello studente ESU offrono prezzi calmierati ma con graduatorie ISEE e disponibilità limitata.",
      },
      {
        type: "h3",
        content: "Studentati privati come Napoleone",
      },
      {
        type: "p",
        content:
          "I studentati privati sono strutture pensate interamente per studenti universitari: prezzo fisso all-inclusive, servizi comuni (lavanderia, sala studio, WiFi), contratti flessibili e una comunità già formata. Non hai bisogno di cercare coinquilini, comprare mobili o gestire le bollette separatamente.",
      },
      {
        type: "h2",
        content: "Quanto costa una stanza a Padova nel 2026",
      },
      {
        type: "p",
        content:
          "I prezzi variano moltissimo in base alla zona, al tipo di stanza e a cosa è incluso. Questa è la mappa dei prezzi medi mensili che dovresti aspettarti:",
      },
      {
        type: "ul",
        items: [
          "Posto letto in camera multipla (3+ persone): €200–€280/mese",
          "Camera doppia (2 persone): €280–€400/mese a testa",
          "Camera singola in appartamento condiviso: €400–€550/mese",
          "Monolocale: €600–€800/mese",
          "Studentato con servizi inclusi: €380–€580/mese (tutto compreso)",
        ],
      },
      {
        type: "callout",
        emoji: "💡",
        content:
          "Attenzione ai costi nascosti: a una stanza da €420/mese in appartamento, aggiungi facilmente €80-120 di bollette, €30 di internet, pulizie a rotazione e possibili spese condominiali. Il totale reale spesso supera quello di uno studentato all-inclusive.",
      },
      {
        type: "h2",
        content: "Le zone migliori dove abitare a Padova da studente",
      },
      {
        type: "p",
        content:
          "Padova è una città relativamente compatta, ma le distanze contano. Ecco le zone più popolari tra gli studenti:",
      },
      {
        type: "h3",
        content: "Centro storico",
      },
      {
        type: "p",
        content:
          "La zona più ambita: a piedi o in bici raggiungi qualsiasi facoltà in 10-15 minuti. Prezzi più alti (€500+ per singola), ma zero spese di trasporto e massima vivibilità.",
      },
      {
        type: "h3",
        content: "Quartiere Arcella",
      },
      {
        type: "p",
        content:
          "A nord del centro, ben collegata con bus e piste ciclabili. Prezzi più contenuti, buona offerta commerciale. Popolare soprattutto tra studenti di medicina (vicino agli ospedali).",
      },
      {
        type: "h3",
        content: "Quartiere Portello / Stazione",
      },
      {
        type: "p",
        content:
          "Vicino alla stazione ferroviaria, ideale per chi viene spesso a casa in treno. Zona vivace con ottima connessione ai trasporti pubblici.",
      },
      {
        type: "h2",
        content: "Documenti che ti servono per affittare una stanza",
      },
      {
        type: "p",
        content:
          "Prima di iniziare le visite, prepara già i documenti. Molti proprietari chiedono tutto subito e le stanze più richieste vengono assegnate in poche ore:",
      },
      {
        type: "ol",
        items: [
          "Documento d'identità valido (carta d'identità o passaporto)",
          "Codice fiscale",
          "Certificato di iscrizione universitaria (scaricabile dal portale di ateneo)",
          "Contratto o lettera di ammissione (per i fuori sede che non sono ancora iscritti)",
          "Garante: spesso richiesto per studenti senza reddito. Di solito un genitore firma come garante e presenta la dichiarazione dei redditi",
          "ISEE se stai cercando posti ESU o studentati convenzionati",
        ],
      },
      {
        type: "h2",
        content: "Come evitare le truffe sugli affitti studenteschi",
      },
      {
        type: "p",
        content:
          "Le truffe sugli affitti sono purtroppo frequenti nelle città universitarie. Ecco i segnali d'allarme da riconoscere:",
      },
      {
        type: "ul",
        items: [
          "Prezzo molto sotto la media di mercato senza spiegazione",
          "Il proprietario dice di essere all'estero e non può mostrare la stanza",
          "Ti chiedono di pagare un deposito prima di firmare qualsiasi contratto",
          "L'annuncio usa foto troppo perfette (probabile furto da altri siti)",
          "Nessuna possibilità di visita in video-call",
          "Chiedono pagamento tramite bonifico su conto estero o gift card",
        ],
      },
      {
        type: "callout",
        emoji: "🔴",
        content:
          "Regola d'oro: non mandare mai soldi senza aver firmato un contratto registrato e senza aver visto la stanza (anche solo in video). Un contratto registrato all'Agenzia delle Entrate tutela entrambe le parti.",
      },
      {
        type: "h2",
        content: "Studentato vs appartamento: cosa conviene davvero",
      },
      {
        type: "p",
        content:
          "La scelta dipende dal tuo stile di vita e dalle tue priorità. Se vuoi la massima indipendenza e hai già amici con cui condividere, un appartamento privato può andar bene. Se invece sei nuovo in città, vuoi evitare lo stress della gestione domestica e cerchi subito una comunità, lo studentato è quasi sempre la scelta migliore.",
      },
      {
        type: "ul",
        items: [
          "Studentato: tutto incluso, contratto flessibile, comunità pronta, zero gestione bollette",
          "Appartamento privato: più autonomia, possibile risparmio se condiviso in molti, ma più responsabilità",
        ],
      },
      {
        type: "highlight",
        content:
          "Allo Studentato Napoleone trovi camere disponibili da settembre 2026 con contratto flessibile, WiFi fibra, servizi inclusi e una comunità di studenti universitari già attiva. Puoi richiedere informazioni senza impegno.",
      },
    ],
  },
  {
    slug: "costo-vita-padova-studenti-2026",
    title: "Quanto costa vivere a Padova da studente universitario? Tutte le spese nel 2026",
    seoTitle: "Costo della Vita a Padova Studenti 2026 — Affitto, Cibo e Trasporti",
    seoDescription:
      "Quanto spende davvero uno studente a Padova nel 2026? Cifre reali su affitto (€390–€550/mese), cibo, trasporti, libri e svago. Consigli pratici per risparmiare e vivere bene con un budget studentesco.",
    excerpt:
      "Affitto, cibo, libri, trasporti, svago: scopri quanto costa davvero vivere a Padova da studente con cifre aggiornate al 2026 e consigli per risparmiare senza rinunciare a nulla.",
    category: "Budget & Risparmio",
    date: "2026-09-05",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=630&fit=crop",
    imageAlt: "Studente pianifica budget con calcolatrice e taccuino",
    blocks: [
      {
        type: "p",
        content:
          "Padova è una città universitaria con un costo della vita medio-alto rispetto alla media italiana. Non è Milano o Roma, ma nemmeno una piccola città del Sud. Prima di trasferirti, è fondamentale avere un'idea chiara di quanto spenderai ogni mese — sia per pianificare il budget familiare, sia per valutare se hai bisogno di una borsa di studio o di un lavoro part-time.",
      },
      {
        type: "h2",
        content: "Il budget mensile medio di uno studente a Padova",
      },
      {
        type: "p",
        content:
          "In base a dati aggiornati al 2026, uno studente fuori sede a Padova spende in media tra €900 e €1.300 al mese, tasse universitarie escluse. Vediamo nel dettaglio ogni voce:",
      },
      {
        type: "h2",
        content: "1. Affitto e alloggio: la spesa principale",
      },
      {
        type: "p",
        content:
          "L'alloggio rappresenta il 40-50% del budget mensile di uno studente. Ecco i costi medi per tipo di soluzione abitativa:",
      },
      {
        type: "ul",
        items: [
          "Casa dello studente ESU (con borsa): €100–€200/mese (con ISEE basso)",
          "Posto letto in stanza multipla: €250–€300/mese",
          "Camera doppia in appartamento: €350–€430/mese",
          "Camera singola in appartamento condiviso: €420–€560/mese",
          "Studentato privato all-inclusive (es. Napoleone): €380–€580/mese",
          "Monolocale: €650–€900/mese",
        ],
      },
      {
        type: "callout",
        emoji: "💡",
        content:
          "Se scegli un appartamento privato, ricordati di aggiungere alle spese di affitto anche bollette (€60–€120/mese in condivisione), internet (€25–€35/mese) e pulizie. Uno studentato all-inclusive elimina tutte queste variabili.",
      },
      {
        type: "h2",
        content: "2. Alimentazione: quanto si spende per mangiare a Padova",
      },
      {
        type: "p",
        content:
          "Padova ha una buona rete di mense universitarie (Mensa Agripolis, mensa di via Venezia, mensa di Scienze) con prezzi agevolati per studenti UniPD. Un pasto completo costa €4–€6 con la tessera universitaria.",
      },
      {
        type: "ul",
        items: [
          "Spesa al supermercato (mese): €150–€200",
          "Mensa universitaria (5 giorni/settimana): €80–€100/mese",
          "Colazione al bar (quotidiana): €40–€60/mese",
          "Cena o aperitivo fuori (settimanale): €60–€100/mese",
          "TOTALE CIBO stimato: €280–€400/mese",
        ],
      },
      {
        type: "h3",
        content: "Consigli per risparmiare sul cibo",
      },
      {
        type: "ul",
        items: [
          "Usa la mensa universitaria: è il modo più economico per mangiare bene",
          "Fai la spesa al Lidl, Eurospin o al mercato di Piazza delle Erbe (sabato mattina prezzi ottimi)",
          "Cucina in gruppo se sei in uno studentato o in appartamento condiviso",
          "Le app anti-spreco come Too Good To Go offrono pasti di qualità a €3–€5",
        ],
      },
      {
        type: "h2",
        content: "3. Trasporti: spostarsi a Padova",
      },
      {
        type: "p",
        content:
          "Padova è una città ideale per spostarsi in bicicletta: è piatta, compatta e ha un'ottima rete di piste ciclabili. La maggior parte degli studenti usa la bici come mezzo principale.",
      },
      {
        type: "ul",
        items: [
          "Abbonamento bus urbano APS (annuale studenti): ~€180/anno (€15/mese)",
          "Bici usata: €50–€150 (acquisto una tantum, poi quasi zero manutenzione)",
          "Monopattino elettrico (app sharing): €20–€40/mese se usato regolarmente",
          "Treno Padova-casa (mensile): variabile, in media €60–€120/mese",
        ],
      },
      {
        type: "callout",
        emoji: "🚲",
        content:
          "Consiglio: investi in una bici decente fin dal primo giorno. Con una bici puoi raggiungere qualsiasi facoltà in 10-15 minuti senza spendere nulla. Il ROI è eccellente dopo pochi mesi.",
      },
      {
        type: "h2",
        content: "4. Libri e materiale universitario",
      },
      {
        type: "p",
        content:
          "I libri universitari rappresentano una spesa significativa, specialmente al primo anno. Ecco come gestirla:",
      },
      {
        type: "ul",
        items: [
          "Libri nuovi (primo anno): €200–€600 secondo il corso di laurea",
          "Libri usati o PDF (anni successivi): €50–€150",
          "Materiale di cancelleria: €20–€40/mese",
          "Software e abbonamenti (Office, Adobe, ecc.): spesso gratuiti con l'account universitario UniPD",
        ],
      },
      {
        type: "h3",
        content: "Come risparmiare sui libri",
      },
      {
        type: "ul",
        items: [
          "Cerca libri di seconda mano su Facebook Marketplace e nei gruppi degli studenti di facoltà",
          "La Biblioteca Universitaria di Padova offre prestito gratuito di quasi tutti i testi adottati",
          "Molti professori mettono le dispense su Moodle: aspetta la prima settimana prima di comprare",
          "Acquista in gruppo: un testo in comune per chi studia lo stesso esame",
        ],
      },
      {
        type: "h2",
        content: "5. Svago, sport e vita sociale",
      },
      {
        type: "p",
        content:
          "Padova offre tantissimo da fare: aperitivi in centro, concerti, cinema, sport, eventi universitari. Non serve spendere molto per avere una buona vita sociale.",
      },
      {
        type: "ul",
        items: [
          "Abbonamento palestra o CUS Padova (Centro Universitario Sportivo): €150–€250/anno",
          "Cinema, aperitivi, cene fuori: €80–€150/mese (dipende molto dallo stile di vita)",
          "Abbonamento streaming (Netflix, Spotify): €10–€15/mese",
          "Viaggi e weekend fuori: variabile, ma Padova è ben collegata a Venezia, Verona, Treviso",
        ],
      },
      {
        type: "h2",
        content: "Il budget totale mensile: quadro riassuntivo",
      },
      {
        type: "ul",
        items: [
          "Alloggio all-inclusive (studentato): €380–€580",
          "Cibo: €280–€400",
          "Trasporti: €20–€60",
          "Libri e materiale: €20–€50 (media annuale)",
          "Svago: €80–€150",
          "Varie e imprevisti: €50–€100",
          "TOTALE: €830–€1.340/mese",
        ],
      },
      {
        type: "callout",
        emoji: "📊",
        content:
          "Se vivi in uno studentato all-inclusive come Napoleone, elimini dal budget le bollette, internet, pulizie comuni e spese di gestione. La prevedibilità della spesa mensile è uno dei vantaggi principali: sai esattamente quanto spendi ogni mese.",
      },
      {
        type: "h2",
        content: "Borse di studio e agevolazioni per studenti a Padova",
      },
      {
        type: "p",
        content:
          "Esistono diverse forme di supporto economico che possono ridurre significativamente il costo della vita a Padova:",
      },
      {
        type: "ul",
        items: [
          "Borsa di studio ESU Veneto: fino a €5.700/anno per studenti con ISEE < €23.000",
          "Esonero tasse universitarie UniPD: per studenti meritevoli o con ISEE basso",
          "Posto letto ESU agevolato: case dello studente a prezzi ridotti",
          "Borse 'No Tax Area' UniPD: studenti con ISEE < €30.000 pagano zero tasse",
          "Premi di laurea e borse merito: riservate agli studenti con ottima carriera",
        ],
      },
      {
        type: "highlight",
        content:
          "Scegliere uno studentato come Napoleone significa avere costi fissi e prevedibili. Nessuna bolletta a sorpresa di gennaio, nessun coinquilino che non paga la sua parte. Un modo concreto per tenere il budget sotto controllo.",
      },
    ],
  },
  {
    slug: "studentato-vs-appartamento-padova",
    title: "Studentato o appartamento privato a Padova? La guida definitiva 2026",
    seoTitle: "Studentato vs Appartamento Padova 2026 — Confronto Costi e Servizi",
    seoDescription:
      "Studentato o appartamento a Padova? Confronto reale su costi (€390 tutto incluso vs €450+ con bollette), contratti, servizi e qualità della vita. Scopri quale conviene davvero per gli studenti universitari.",
    excerpt:
      "Studentato o appartamento privato? È la domanda che si fa ogni studente che arriva a Padova. Confrontiamo costi veri, qualità della vita e flessibilità per aiutarti a scegliere.",
    category: "Guida Pratica",
    date: "2026-09-10",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=630&fit=crop",
    imageAlt: "Camera moderna in studentato a Padova",
    blocks: [
      {
        type: "p",
        content:
          "Ogni anno migliaia di studenti si trovano a dover scegliere tra due opzioni: vivere in uno studentato o affittare un appartamento privato. Non c'è una risposta universale — dipende dal tuo stile di vita, dal tuo budget, da quanto sei organizzato e da quanto sei disposto a gestire. Questa guida analizza entrambe le opzioni in modo onesto, senza vendere nulla.",
      },
      {
        type: "h2",
        content: "Il confronto sui costi: cosa paghi davvero",
      },
      {
        type: "p",
        content:
          "Il costo dell'affitto è solo la punta dell'iceberg. Per fare un confronto equo bisogna mettere insieme tutte le spese mensili:",
      },
      {
        type: "h3",
        content: "Appartamento privato — costi reali",
      },
      {
        type: "ul",
        items: [
          "Affitto camera singola: €420–€550/mese",
          "Quota bollette (luce, gas, acqua): €60–€120/mese",
          "Internet: €25–€35/mese",
          "Pulizie (materiali, turnazione): €10–€20/mese",
          "Spese condominiali (variabile): €20–€50/mese",
          "Deposito cauzionale iniziale: 2-3 mesi di affitto (€840–€1.650) bloccati per anni",
          "TOTALE MENSILE: €535–€775",
        ],
      },
      {
        type: "h3",
        content: "Studentato privato all-inclusive — costi reali",
      },
      {
        type: "ul",
        items: [
          "Camera singola standard: €480/mese (tutto incluso)",
          "WiFi fibra incluso: €0",
          "Pulizie spazi comuni incluse: €0",
          "Utenze tutte incluse: €0",
          "Deposito: spesso inferiore all'affitto privato",
          "TOTALE MENSILE: €480 (fisso, senza sorprese)",
        ],
      },
      {
        type: "callout",
        emoji: "📊",
        content:
          "La differenza di costo reale è spesso minima — e a volte il studentato è più economico dell'appartamento quando si somma tutto. Ma il vantaggio più grande è la prevedibilità: sai esattamente quanto spenderai ogni mese.",
      },
      {
        type: "h2",
        content: "La flessibilità contrattuale",
      },
      {
        type: "p",
        content:
          "Uno degli aspetti più sottovalutati nella scelta è la flessibilità del contratto. E qui la differenza tra studentato e appartamento è enorme.",
      },
      {
        type: "h3",
        content: "Appartamento privato",
      },
      {
        type: "p",
        content:
          "I contratti di locazione per studenti più comuni sono il contratto 'uso abitativo' (4+4 anni) e il contratto 'per studenti universitari' (6-36 mesi). In teoria quest'ultimo è pensato per voi, ma in pratica molti proprietari preferiscono contratti più lunghi. Rompere un contratto in anticipo può costare mesi di affitto.",
      },
      {
        type: "h3",
        content: "Studentato privato",
      },
      {
        type: "p",
        content:
          "I buoni studentati offrono contratti mensili o semestrali con disdetta breve (30 giorni). Questo è un vantaggio enorme se: cambi università, vinci una borsa all'estero, trovi una situazione migliore, o semplicemente le cose non vanno come previsto.",
      },
      {
        type: "h2",
        content: "La qualità della vita quotidiana",
      },
      {
        type: "p",
        content:
          "Vivere in appartamento o in studentato cambia profondamente la vita di tutti i giorni. Ecco una panoramica onesta di entrambe le esperienze:",
      },
      {
        type: "h3",
        content: "In appartamento privato",
      },
      {
        type: "ul",
        items: [
          "Più autonomia nella gestione degli spazi",
          "Puoi scegliere con chi vivere (se hai già amici)",
          "Cucini tu — pro o contro a seconda di come la vedi",
          "Devi gestire bollette, riparazioni, rapporti col proprietario",
          "Rischio coinquilini incompatibili (rumore, pulizia, orari diversi)",
          "La socialità dipende da chi hai scelto come coinquilino",
        ],
      },
      {
        type: "h3",
        content: "In studentato",
      },
      {
        type: "ul",
        items: [
          "Comunità già formata: conosci subito persone nuove",
          "Spazi comuni curati (sala studio, cucina, sala relax)",
          "Staff presente per qualsiasi problema",
          "Nessuna gestione burocratica di bollette o riparazioni",
          "Meno privacy rispetto a un appartamento privato",
          "Regole di convivenza (non sempre un aspetto negativo)",
        ],
      },
      {
        type: "h2",
        content: "Chi dovrebbe scegliere lo studentato",
      },
      {
        type: "ul",
        items: [
          "Sei nuovo in città e non conosci nessuno",
          "Vuoi concentrarti sullo studio senza distrazioni gestionali",
          "Preferisci un budget fisso e prevedibile",
          "Ti piace l'idea di vivere in comunità e fare nuove amicizie",
          "Non sai ancora quanto tempo resterai (hai bisogno di flessibilità)",
          "I tuoi genitori vogliono sapere che sei in un posto sicuro e organizzato",
        ],
      },
      {
        type: "h2",
        content: "Chi dovrebbe scegliere l'appartamento privato",
      },
      {
        type: "ul",
        items: [
          "Hai già amici fidati con cui vuoi vivere",
          "Vuoi la massima autonomia e non ti interessano gli spazi comuni",
          "Sei organizzato e non hai problemi a gestire bollette e contratto",
          "Sei al secondo o terzo anno e conosci già bene la città",
          "Hai trovato un'offerta economicamente molto conveniente",
        ],
      },
      {
        type: "h2",
        content: "La scelta per i genitori: cosa pesa di più",
      },
      {
        type: "p",
        content:
          "Se sei un genitore che sta leggendo questa guida, sappi che la preoccupazione principale è quasi sempre la stessa: il figlio starà bene? Sarà al sicuro? Mangerà? Lo studentato privato risponde meglio a queste domande rispetto a un appartamento anonimo: c'è uno staff presente, spazi controllati, una comunità, e spesso anche una reception o un referente disponibile.",
      },
      {
        type: "highlight",
        content:
          "Allo Studentato Napoleone di Padova offriamo tutto questo: contratto flessibile, prezzo all-inclusive, comunità attiva e staff dedicato. Puoi richiedere una visita gratuita o informazioni senza impegno.",
      },
    ],
  },
  {
    slug: "quartieri-padova-studenti-universitari",
    title: "I migliori quartieri di Padova per gli studenti universitari: guida zona per zona",
    seoTitle: "Migliori Quartieri Padova per Studenti Universitari — Guida 2026",
    seoDescription:
      "Qual è il quartiere migliore di Padova per studenti universitari? Centro storico, Arcella, Portello e oltre: prezzi medi per zona, distanza da UniPD, trasporti e qualità della vita a confronto.",
    excerpt:
      "Centro storico, Arcella, Portello o dintorni? Guida completa ai quartieri di Padova per studenti universitari, con prezzi medi, distanze dalle facoltà e qualità della vita.",
    category: "Vita a Padova",
    date: "2026-09-15",
    readTime: 8,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop",
    imageAlt: "Panorama del centro storico di Padova con caffè all'aperto",
    blocks: [
      {
        type: "p",
        content:
          "Padova è una città relativamente compatta ma con quartieri molto diversi tra loro per atmosfera, prezzi, distanze e servizi. Scegliere il quartiere giusto può fare la differenza tra un'esperienza universitaria stressante e una davvero bella. Ecco una guida onesta e aggiornata per aiutarti a orientarti.",
      },
      {
        type: "h2",
        content: "Centro storico di Padova: la scelta premium",
      },
      {
        type: "p",
        content:
          "Il centro storico di Padova è il cuore pulsante della città universitaria. Le facoltà principali di lettere, filosofia, legge, scienze politiche, economia e medicina veterinaria si trovano qui o nelle immediate vicinanze. Vivere in centro significa raggiungere quasi tutto a piedi.",
      },
      {
        type: "h3",
        content: "Vantaggi del centro storico",
      },
      {
        type: "ul",
        items: [
          "Tutto raggiungibile a piedi o in bici in 5-15 minuti",
          "Vita sociale ricchissima: bar, aperitivi, ristoranti, eventi culturali",
          "Piazza delle Erbe, Piazza dei Signori: cuore della movida studentesca",
          "Vicino alla Biblioteca Universitaria di Padova",
          "Piastre ciclabili ovunque, nessun bisogno di bus o auto",
        ],
      },
      {
        type: "h3",
        content: "Svantaggi",
      },
      {
        type: "ul",
        items: [
          "Prezzi tra i più alti: camera singola €480–€600+/mese",
          "Rumore notturno nei weekend (zone movida)",
          "Poco verde e parcheggi difficili",
          "Strade strette e traffico limitato (ZTL estesa)",
        ],
      },
      {
        type: "callout",
        emoji: "📍",
        content:
          "Lo Studentato Napoleone si trova in pieno centro di Padova, a pochi passi dalle principali facoltà. Prezzi all-inclusive da €380/mese.",
      },
      {
        type: "h2",
        content: "Quartiere Arcella: la scelta degli studenti di medicina",
      },
      {
        type: "p",
        content:
          "L'Arcella è il quartiere a nord del centro, separato dal Portello e dalla zona universitaria. È la zona preferita dagli studenti di medicina e scienze biomediche grazie alla vicinanza con l'Azienda Ospedaliero-Universitaria di Padova.",
      },
      {
        type: "h3",
        content: "Vantaggi dell'Arcella",
      },
      {
        type: "ul",
        items: [
          "Prezzi più accessibili del centro: camera singola €380–€480/mese",
          "Ottimi collegamenti in bus verso il centro e le facoltà",
          "Quartiere multiculturale e vivace",
          "Buona offerta commerciale (supermercati, mercato Arcella)",
          "Ideale per studenti di medicina (vicino agli ospedali)",
        ],
      },
      {
        type: "h3",
        content: "Svantaggi",
      },
      {
        type: "ul",
        items: [
          "Zona meno 'universitaria' nel carattere rispetto al centro",
          "Alcune zone meno curate",
          "Devi prendere il bus per le facoltà del centro (10-15 min)",
        ],
      },
      {
        type: "h2",
        content: "Zona Portello: tra il centro e l'Arcella",
      },
      {
        type: "p",
        content:
          "Il Portello è una zona di transizione tra il centro storico e l'Arcella, molto ben collegata con la stazione ferroviaria. È apprezzata da studenti che viaggiano spesso in treno e da chi cerca un compromesso tra posizione e prezzo.",
      },
      {
        type: "ul",
        items: [
          "A 10-15 minuti a piedi dalla stazione",
          "Ben collegata con bus per tutte le facoltà",
          "Prezzi medi: camera singola €400–€500/mese",
          "Mercato del Portello (giovedì): ottimo per la spesa fresca a prezzi bassi",
        ],
      },
      {
        type: "h2",
        content: "Agripolis e Legnaro: la scelta degli studenti di agraria e veterinaria",
      },
      {
        type: "p",
        content:
          "Il Campus di Agripolis si trova a Legnaro, fuori Padova. Se studi Agraria, Medicina Veterinaria o Scienze Naturali, potresti trovare conveniente vivere vicino al campus — ma considera che la vita sociale sarà concentrata lì, non in città.",
      },
      {
        type: "ul",
        items: [
          "Molti studenti preferiscono vivere in centro e prendere il bus/bici",
          "Il campus ha mensa e alcuni servizi",
          "Bus SITA e piste ciclabili collegano Padova-Legnaro in ~30 minuti",
          "Prezzi fuori Padova più bassi ma meno offerta",
        ],
      },
      {
        type: "h2",
        content: "Come scegliere il quartiere giusto: 5 domande da farti",
      },
      {
        type: "ol",
        items: [
          "Dove si trova la tua facoltà principale? Mappa le distanze in bici.",
          "Hai una vita sociale attiva? Preferiresti il centro o un quartiere più tranquillo?",
          "Qual è il tuo budget? Considera tutte le spese, non solo l'affitto.",
          "Hai bisogno del treno spesso? Valuta la vicinanza alla stazione.",
          "Hai già amici o coinquilini? O stai cercando una comunità già formata?",
        ],
      },
      {
        type: "h2",
        content: "La scelta del centro storico con servizi inclusi",
      },
      {
        type: "p",
        content:
          "Se vuoi vivere in centro senza pagare prezzi proibitivi, un'opzione eccellente è lo studentato: prezzo all-inclusive, nessuna sorpresa di bollette, comunità già formata. È il modo più intelligente per stare nel cuore di Padova con un costo totale competitivo.",
      },
      {
        type: "highlight",
        content:
          "Lo Studentato Napoleone si trova nel centro di Padova con camere da €380/mese (tutto incluso). Richiedi una visita gratuita e scopri com'è vivere qui.",
      },
    ],
  },
  {
    slug: "guida-universita-padova-nuovi-iscritti",
    title: "Guida completa all'Università di Padova per i nuovi iscritti: tutto quello che devi sapere nel 2026",
    seoTitle: "Università di Padova Nuovi Iscritti 2026-27 — Guida Completa UniPD",
    seoDescription:
      "Guida completa per i nuovi iscritti all'Università di Padova 2026-27: facoltà, tasse, borse di studio Er.Go, servizi studenti, dove abitare e come trovare alloggio vicino a UniPD.",
    excerpt:
      "Guida completa per chi si iscrive all'Università di Padova nel 2026: facoltà, tasse, borse di studio, servizi per studenti, dove abitare e come integrarsi nella vita universitaria.",
    category: "Vita Universitaria",
    date: "2026-09-20",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=630&fit=crop",
    imageAlt: "Palazzo del Bo, sede storica dell'Università di Padova",
    blocks: [
      {
        type: "p",
        content:
          "L'Università di Padova — fondata nel 1222 — è una delle università più antiche del mondo e una delle più prestigiose d'Italia. Con oltre 65.000 studenti iscritti, decine di corsi di laurea e un campus distribuito in tutta la città, può sembrare disorientante all'inizio. Questa guida ti aiuta a orientarti.",
      },
      {
        type: "h2",
        content: "Le facoltà dell'Università di Padova e dove si trovano",
      },
      {
        type: "p",
        content:
          "UniPD non ha un campus centralizzato: le diverse scuole e dipartimenti sono distribuiti in tutta la città. Conoscere dove si trova la tua facoltà è fondamentale per scegliere dove abitare.",
      },
      {
        type: "ul",
        items: [
          "Centro storico (Palazzo del Bo e dintorni): Giurisprudenza, Lettere, Scienze Politiche, Psicologia, Filosofia",
          "Zona Ospedale (via Giustiniani): Medicina e Chirurgia, Medicina Veterinaria",
          "Campus di Agripolis (Legnaro): Agraria, Scienze Naturali",
          "Zona Torre Archimede: Scienze, Matematica, Informatica, Ingegneria",
          "Zona Nord: Economia, Statistica",
          "Vicenza, Treviso, Rovigo: sedi distaccate di alcuni corsi",
        ],
      },
      {
        type: "h2",
        content: "Come funziona l'iscrizione all'Università di Padova",
      },
      {
        type: "p",
        content:
          "Il processo di iscrizione varia a seconda del tipo di corso. Ecco una panoramica:",
      },
      {
        type: "h3",
        content: "Corsi a numero programmato (accesso con test)",
      },
      {
        type: "p",
        content:
          "Medicina, Odontoiatria, Architettura, alcune lauree di Ingegneria, Psicologia e Scienze della Formazione Primaria hanno un numero chiuso. Il test di ammissione si svolge in date nazionali (TOLC, test ministeriali) e la graduatoria determina chi viene ammesso.",
      },
      {
        type: "h3",
        content: "Corsi ad accesso libero",
      },
      {
        type: "p",
        content:
          "La maggior parte dei corsi di laurea triennale è ad accesso libero: puoi iscriverti online sul portale UniPD (https://www.unipd.it) entro le scadenze previste, generalmente agosto-settembre per l'anno accademico che inizia in ottobre.",
      },
      {
        type: "h2",
        content: "Le tasse universitarie e le agevolazioni economiche",
      },
      {
        type: "p",
        content:
          "UniPD ha un sistema di tasse progressive basato sull'ISEE (Indicatore della Situazione Economica Equivalente). Ecco come funziona:",
      },
      {
        type: "ul",
        items: [
          "No Tax Area: se il tuo ISEE è inferiore a €30.000, non paghi tasse (solo bollo da €16)",
          "ISEE €30.000–€55.000: tasse ridotte in modo progressivo",
          "ISEE sopra €55.000: tasse standard (variano da €2.000 a €4.000 annui)",
          "Prima rata (tassa di iscrizione): agosto-settembre",
          "Seconda rata: gennaio-febbraio",
          "Terza rata: aprile-maggio (per alcuni corsi)",
        ],
      },
      {
        type: "callout",
        emoji: "💰",
        content:
          "Fai la DSU (Dichiarazione Sostitutiva Unica) e calcola il tuo ISEE ogni anno entro marzo. È fondamentale per accedere alle agevolazioni sulle tasse e alle borse di studio ESU.",
      },
      {
        type: "h2",
        content: "Le borse di studio: come funzionano e chi può ottenerle",
      },
      {
        type: "p",
        content:
          "Esistono due tipi principali di borse di studio per gli studenti di UniPD:",
      },
      {
        type: "h3",
        content: "Borsa di studio ESU Veneto",
      },
      {
        type: "p",
        content:
          "L'ESU (Ente per il Diritto allo Studio Universitario del Veneto) eroga borse di studio annuali per studenti con ISEE basso e buoni risultati accademici. L'importo varia da €2.500 a €5.700 l'anno (di più se sei fuori sede). Domanda: giugno-settembre ogni anno.",
      },
      {
        type: "h3",
        content: "Borse di merito UniPD",
      },
      {
        type: "p",
        content:
          "UniPD offre anche premi di merito per studenti con ottima carriera universitaria, indipendentemente dall'ISEE. Esistono anche borse internazionali Erasmus+ e borse di ricerca.",
      },
      {
        type: "h2",
        content: "I servizi per gli studenti di UniPD",
      },
      {
        type: "p",
        content:
          "L'Università di Padova offre un'ampia gamma di servizi che molti studenti non conoscono o sottoutilizzano:",
      },
      {
        type: "ul",
        items: [
          "CUS Padova (Centro Universitario Sportivo): accesso a palestre, piscine, sport di squadra a prezzi convenzionati",
          "Biblioteche universitarie: 15+ biblioteche specializzate, accesso gratuito con tessera universitaria",
          "Mense universitarie ESU: pasti completi da €4 con badge universitario",
          "Servizio di orientamento psicologico: gratuito per studenti UniPD",
          "Career Service: supporto per stage, tirocini e inserimento lavorativo",
          "Ufficio Erasmus: per programmi di scambio internazionale",
          "Buddy Program: studenti senior che aiutano i nuovi arrivati",
        ],
      },
      {
        type: "h2",
        content: "Come funziona Moodle e i portali online di UniPD",
      },
      {
        type: "p",
        content:
          "L'università usa diversi portali online che devi imparare a usare subito:",
      },
      {
        type: "ul",
        items: [
          "Uniweb: portale carriera (iscrizione esami, pagamento tasse, visualizzazione voti)",
          "Moodle: piattaforma dove i professori caricano materiali, dispense e compiti",
          "Webmail UniPD: casella email universitaria (usa questa per i professori)",
          "Infostud/UniPD App: app mobile per consultare informazioni",
        ],
      },
      {
        type: "h2",
        content: "Dove abitare: la scelta più importante",
      },
      {
        type: "p",
        content:
          "Trovare il posto giusto dove abitare a Padova è forse la decisione più importante che farai come nuovo studente. Può influenzare la tua produttività, la tua vita sociale e il tuo benessere generale.",
      },
      {
        type: "p",
        content:
          "I nuovi iscritti che non conoscono ancora la città tendono a stare meglio in uno studentato: trovano subito una comunità, non devono gestire problemi domestici e hanno tutto il necessario per iniziare a studiare da subito.",
      },
      {
        type: "highlight",
        content:
          "Lo Studentato Napoleone accoglie ogni anno nuovi studenti UniPD offrendo un ambiente ideale per iniziare la vita universitaria: camere moderne, spazi comuni, WiFi fibra e una comunità già attiva. Contattaci per disponibilità.",
      },
    ],
  },
  {
    slug: "checklist-trasferirsi-padova-studente",
    title: "Checklist completa per trasferirsi a Padova da studente: tutto quello che devi fare prima e dopo l'arrivo",
    seoTitle: "Trasferirsi a Padova da Studente 2026 — Checklist Documenti e Alloggio",
    seoDescription:
      "Stai per trasferirti a Padova per l'università? Checklist operativa passo-passo: trovare alloggio, residenza, banca, abbonamento bus, borse di studio Er.Go e tutto quello che devi fare prima e dopo l'arrivo.",
    excerpt:
      "Stai per trasferirti a Padova? Questa checklist operativa ti guida attraverso tutti i passi: cosa fare prima di partire, nei primi giorni e nel primo mese. Niente ansia — c'è tutto.",
    category: "Guida Pratica",
    date: "2026-09-25",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=630&fit=crop",
    imageAlt: "Checklist e valigie per trasferirsi a Padova",
    blocks: [
      {
        type: "p",
        content:
          "Trasferirsi in una nuova città per l'università è una delle esperienze più entusiasmanti — e più stressanti — della vita. Ci sono cose da fare prima di partire, cose da fare appena arrivi e cose da organizzare nel primo mese. Questa checklist ti aiuta a non dimenticare nulla di importante.",
      },
      {
        type: "h2",
        content: "DA FARE PRIMA DI PARTIRE (2-4 settimane prima)",
      },
      {
        type: "h3",
        content: "Alloggio",
      },
      {
        type: "ul",
        items: [
          "Conferma la prenotazione della stanza o del posto letto",
          "Firma il contratto e conserva una copia digitale",
          "Verifica le modalità di check-in e chi contattare all'arrivo",
          "Chiedi se ci sono regole specifiche per i traslochi (orari, ascensori, ecc.)",
        ],
      },
      {
        type: "h3",
        content: "Documenti",
      },
      {
        type: "ul",
        items: [
          "Carta d'identità valida (se scaduta, rinnovala prima di partire)",
          "Tessera sanitaria aggiornata",
          "Codice fiscale",
          "Certificato di iscrizione universitaria (scaricabile da Uniweb)",
          "Libretto universitario (se cartaceo)",
          "Copia del contratto d'affitto",
          "Foto tessera (ti serviranno per la tessera biblioteca, mensa, CUS, ecc.)",
        ],
      },
      {
        type: "h3",
        content: "Banca e finanze",
      },
      {
        type: "ul",
        items: [
          "Apri un conto corrente (preferibilmente online come N26, Revolut, Hype — zero canone)",
          "Attiva una carta di debito/credito funzionante",
          "Parla con i tuoi genitori del budget mensile",
          "Calcola l'ISEE e presenta la DSU se non l'hai fatto (per agevolazioni tasse e borse)",
        ],
      },
      {
        type: "h3",
        content: "Cosa portare con te",
      },
      {
        type: "ul",
        items: [
          "Biancheria da letto (lenzuola, federe, coperta) — verifica cosa è incluso nel tuo alloggio",
          "Asciugamani",
          "Kit da bagno essenziale",
          "Adattatori e ciabatte multiple",
          "Laptop e caricatori",
          "Medicinali di uso comune (tachipirina, antistaminici, cerotti)",
          "Un po' di cibo non deperibile per i primi giorni",
        ],
      },
      {
        type: "callout",
        emoji: "💡",
        content:
          "Se vai in uno studentato come Napoleone, verifica in anticipo cosa è già presente nella stanza: spesso trovi armadio, scrivania, cassetti, rete e materasso. Non portare mobili — rischi di non avere spazio.",
      },
      {
        type: "h2",
        content: "DA FARE NEI PRIMI GIORNI",
      },
      {
        type: "h3",
        content: "Sistemazione",
      },
      {
        type: "ul",
        items: [
          "Firma il verbale di consegna delle chiavi e verifica lo stato della stanza",
          "Fai foto di eventuali danni preesistenti e invia email al gestore come prova",
          "Individua le uscite di emergenza e le regole dello stabile",
          "Conosci i tuoi vicini o coinquilini",
        ],
      },
      {
        type: "h3",
        content: "Università",
      },
      {
        type: "ul",
        items: [
          "Attiva le credenziali universitarie (username e password Shibboleth per UniPD)",
          "Accedi a Uniweb e verifica il piano di studi",
          "Configura la casella email universitaria",
          "Scarica il calendario accademico e l'orario delle lezioni",
          "Vai fisicamente alla tua facoltà: orientati rispetto a aule, uffici segreteria, biblioteca",
        ],
      },
      {
        type: "h3",
        content: "Servizi pratici",
      },
      {
        type: "ul",
        items: [
          "Compra una bici (Decathlon, usato su Facebook Marketplace) — è il mezzo di trasporto principale",
          "Attiva un abbonamento bus APS se ne hai bisogno",
          "Individua il supermercato più vicino",
          "Trova la mensa universitaria più vicina alla tua facoltà",
        ],
      },
      {
        type: "h2",
        content: "DA FARE NEL PRIMO MESE",
      },
      {
        type: "h3",
        content: "Residenza e burocrazia",
      },
      {
        type: "ul",
        items: [
          "Valuta se trasferire la residenza a Padova (necessario per alcuni servizi comunali e agevolazioni TARI)",
          "Iscritti al SSN: scegli un medico di base a Padova (vai all'ULSS 6 con documento e tessera sanitaria)",
          "Se sei cittadino UE non italiano: iscrizione all'AIRE o registrazione all'anagrafe",
        ],
      },
      {
        type: "h3",
        content: "Borse di studio e agevolazioni",
      },
      {
        type: "ul",
        items: [
          "Domanda borsa di studio ESU: apre a giugno-luglio, da presentare entro settembre",
          "Verifica l'esonero tasse con il tuo ISEE",
          "Richied la tessera BUS studentesca annuale APS (più economica dell'abbonamento mensile)",
          "Tessera CUS Padova per l'accesso agevolato alle strutture sportive",
        ],
      },
      {
        type: "h3",
        content: "Vita sociale",
      },
      {
        type: "ul",
        items: [
          "Partecipa alle settimane di orientamento UniPD (settembre-ottobre)",
          "Entra nei gruppi Telegram e WhatsApp della tua facoltà e del tuo anno",
          "Esplora la città: Piazza dei Signori, Prato della Valle, Orto Botanico, Riviera Tito Livio",
          "Prova la mensa almeno una volta nella prima settimana",
        ],
      },
      {
        type: "highlight",
        content:
          "Se scegli lo Studentato Napoleone come tua casa a Padova, parti già con un vantaggio: comunità pronta, eventi organizzati, staff disponibile per ogni dubbio. Il tuo primo mese sarà molto meno stressante.",
      },
    ],
  },
  {
    slug: "consigli-genitori-studenti-padova",
    title: "Guida per i genitori: come supportare un figlio che va a studiare a Padova",
    seoTitle: "Guida Genitori: Figlio Studente a Padova — Alloggi, Costi e Sicurezza 2026",
    seoDescription:
      "Tuo figlio studia all'Università di Padova? Guida completa per genitori: come scegliere il miglior alloggio sicuro, quanto budget prevedere, contratti da controllare e come supportarlo a distanza.",
    excerpt:
      "Tuo figlio o tua figlia va a Padova per l'università? Questa guida ti aiuta a capire come valutare l'alloggio, quanto budget prevedere, i rischi da evitare e come trovare la soluzione più sicura.",
    category: "Per i Genitori",
    date: "2026-10-01",
    readTime: 8,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=630&fit=crop",
    imageAlt: "Genitori aiutano figlio a trasferirsi in università",
    blocks: [
      {
        type: "p",
        content:
          "Mandare un figlio all'università in un'altra città è un momento importante per tutta la famiglia. C'è l'orgoglio per il traguardo raggiunto, ma anche l'ansia: starà bene? Sarà al sicuro? Riuscirà a gestirsi? Questa guida è pensata per i genitori che vogliono capire le opzioni disponibili e supportare al meglio i propri figli senza soffocarli.",
      },
      {
        type: "h2",
        content: "La prima decisione: dove farà vivere tuo figlio",
      },
      {
        type: "p",
        content:
          "La scelta dell'alloggio è la decisione più importante e quella che più condizionerà l'esperienza universitaria di tuo figlio. Le opzioni principali sono tre:",
      },
      {
        type: "h3",
        content: "1. Casa dello studente ESU",
      },
      {
        type: "p",
        content:
          "L'ESU (Ente per il Diritto allo Studio) gestisce case dello studente a Padova con prezzi molto contenuti (€200–€350/mese). Sono accessibili tramite graduatoria ISEE: i posti sono limitati e riservati agli studenti con situazione economica più difficile. Se il vostro ISEE è basso, questa è sicuramente la prima opzione da valutare.",
      },
      {
        type: "h3",
        content: "2. Appartamento privato in condivisione",
      },
      {
        type: "p",
        content:
          "L'opzione più comune: tuo figlio affitta una stanza in un appartamento condiviso con altri studenti. Costo: €400–€550/mese solo di affitto, più bollette, internet e spese varie. Richiede una certa organizzazione (gestione condivisa delle spese, rapporto col proprietario, contratto da capire) e può riservare sorprese spiacevoli in termini di coinquilini incompatibili.",
      },
      {
        type: "h3",
        content: "3. Studentato privato",
      },
      {
        type: "p",
        content:
          "Una struttura pensata interamente per studenti universitari: prezzo fisso all-inclusive, staff presente, spazi comuni, regole di convivenza, comunità. Per i genitori è spesso la soluzione preferita: sanno esattamente cosa paga il figlio ogni mese, sanno che c'è qualcuno che vigila sulla struttura, e il figlio trova subito un ambiente sicuro e già organizzato.",
      },
      {
        type: "h2",
        content: "Cosa controllare prima di scegliere uno studentato",
      },
      {
        type: "p",
        content:
          "Non tutti gli studentati sono uguali. Ecco cosa verificare prima di scegliere:",
      },
      {
        type: "ul",
        items: [
          "Il prezzo è davvero all-inclusive? WiFi, utenze, pulizie spazi comuni",
          "Il contratto è flessibile? Con quanti giorni di preavviso si può disdire?",
          "C'è uno staff disponibile per problemi e manutenzione?",
          "Ci sono spazi comuni (sala studio, cucina attrezzata, lavanderia)?",
          "Quali sono le regole di accesso (ospiti, orari, sicurezza)?",
          "Com'è la connessione internet? Fibra o ADSL?",
          "Ci sono telecamere nelle aree comuni per sicurezza?",
          "Puoi visitare la struttura prima di confermare?",
        ],
      },
      {
        type: "h2",
        content: "Quanto budget prevedere per uno studente a Padova",
      },
      {
        type: "p",
        content:
          "La domanda che ogni genitore si fa: quanto devo dare al mese a mio figlio? Ecco una stima realistica per uno studente a Padova:",
      },
      {
        type: "ul",
        items: [
          "Alloggio all-inclusive (studentato): €380–€580/mese",
          "Cibo: €250–€350/mese (mensa + spesa + qualche cena fuori)",
          "Trasporti: €20–€60/mese (bus o bici)",
          "Libri e materiale: €30–€60/mese (prima annualità di più)",
          "Svago: €60–€100/mese",
          "Varie e imprevisti: €50–€100/mese",
          "TOTALE: €790–€1.250/mese",
        ],
      },
      {
        type: "callout",
        emoji: "💡",
        content:
          "Se tuo figlio ottiene la borsa di studio ESU (fino a €5.700/anno per studenti fuori sede con ISEE basso), questa copre buona parte delle spese. Vale la pena fare l'ISEE e presentare domanda anche se non siete sicuri di averne diritto.",
      },
      {
        type: "h2",
        content: "Come supportare tuo figlio a distanza senza soffocare la sua indipendenza",
      },
      {
        type: "p",
        content:
          "Uno degli equilibri più difficili per i genitori è capire quanto essere presenti senza essere opprimenti. Ecco alcuni consigli pratici:",
      },
      {
        type: "ul",
        items: [
          "Stabilite insieme una frequenza di aggiornamento (es. una chiamata a settimana) — non chiamate ogni giorno",
          "Fidatevi della struttura scelta: se avete scelto bene lo studentato, ci sono persone presenti",
          "Non fatevi mandare i voti esame in tempo reale: fatelo sentire libero di gestire il suo percorso",
          "Preparatevi psicologicamente ai momenti di difficoltà: i primi mesi sono spesso i più duri",
          "Venite a trovarlo — Padova è una bella città anche per una visita",
          "Ricordategli le scadenze importanti: ISEE, borse di studio, tasse universitarie",
        ],
      },
      {
        type: "h2",
        content: "I segnali che la situazione non va bene",
      },
      {
        type: "p",
        content:
          "Ci sono situazioni in cui è giusto intervenire più attivamente. Prestate attenzione se:",
      },
      {
        type: "ul",
        items: [
          "Non dorme bene da settimane e sembra esausto anche nel weekend",
          "Si isola socialmente e rifiuta di uscire o fare amicizie",
          "Non mangia regolarmente o perde peso in modo preoccupante",
          "Non riesce a sostenere nessun esame dopo i primi due semestri",
          "Si lamenta spesso dell'alloggio (conflitti, problemi di sicurezza, condizioni degradate)",
          "Chiede più soldi del solito senza spiegazione chiara",
        ],
      },
      {
        type: "h2",
        content: "Lo studentato come soluzione pensata anche per i genitori",
      },
      {
        type: "p",
        content:
          "Uno studentato ben gestito non è solo un posto dove dormire per vostro figlio — è una struttura che vi dà anche a voi la tranquillità di sapere che è in un ambiente sicuro, con servizi funzionanti, in una comunità di pari. Molti genitori ci scrivono dopo aver scelto Napoleone per dirci che questa è stata la parte più facile di tutto il processo.",
      },
      {
        type: "highlight",
        content:
          "Allo Studentato Napoleone di Padova accogliamo ogni anno studenti di tutta Italia. Se volete venire a visitare la struttura insieme a vostro figlio, siamo felici di mostrarvi tutto. Contattateci per prenotare una visita gratuita.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): BlogArticle[] {
  return articles.filter((a) => a.slug !== slug).slice(0, count);
}
