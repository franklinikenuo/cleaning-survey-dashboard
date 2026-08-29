// ============================================================
// UCDS DATA STORE v3.3
// Single Source Of Truth For Survey Data
//
// FIX:
// - Supabase default 1,000-row response limit handled
// - Automatically loads ALL survey records in batches
// - Compatible with dashboard-core.js
// - Compatible with analytics / charts / reports / exports
// - Maintains existing DataStore API
// ============================================================


window.DataStore = {


    surveys: [],

    loading: false,



    // ========================================================
    // CONFIGURATION
    // ========================================================

    PAGE_SIZE: 1000,



    // ========================================================
    // LOAD ALL SURVEYS FROM SUPABASE
    // ========================================================

    async load(){


        if(this.loading){

            console.log(
                "Data load already running"
            );

            return this.surveys;

        }


        this.loading = true;


        try{


            console.log(
                "Loading surveys from Supabase..."
            );


            let allSurveys = [];

            let from = 0;

            let hasMore = true;



            // =================================================
            // PAGINATION LOOP
            // =================================================

            while(hasMore){


                const to =
                    from + this.PAGE_SIZE - 1;



                console.log(
                    `Loading surveys ${from + 1}-${to + 1}...`
                );



                const {
                    data,
                    error
                } = await client

                    .from("surveys")

                    .select("*")

                    .order(
                        "created_at",
                        {
                            ascending:false
                        }
                    )

                    .range(
                        from,
                        to
                    );



                // =============================================
                // SUPABASE ERROR
                // =============================================

                if(error){


                    console.error(
                        "Supabase fetch error:",
                        error
                    );


                    // Keep previously loaded data
                    // if a later page fails.

                    if(allSurveys.length){

                        this.surveys =
                            allSurveys;

                    }


                    return this.surveys;

                }



                // =============================================
                // ADD CURRENT PAGE
                // =============================================

                if(
                    Array.isArray(data) &&
                    data.length
                ){

                    allSurveys.push(
                        ...data
                    );


                    console.log(
                        `Loaded page: ${data.length} surveys`
                    );


                }



                // =============================================
                // DETERMINE WHETHER MORE DATA EXISTS
                // =============================================

                if(
                    !data ||
                    data.length < this.PAGE_SIZE
                ){

                    hasMore = false;

                }
                else{

                    from +=
                        this.PAGE_SIZE;

                }


            }



            // =================================================
            // STORE COMPLETE DATASET
            // =================================================

            this.surveys =
                allSurveys;



            console.log(
                "=========================================="
            );


            console.log(
                "✅ ALL SURVEYS LOADED:",
                this.surveys.length
            );


            console.log(
                "=========================================="
            );



            return this.surveys;


        }


        catch(error){


            console.error(
                "Data load failed:",
                error
            );


            return this.surveys;


        }


        finally{


            this.loading =
                false;


        }


    },





    // ========================================================
    // GET ALL DATA
    // ========================================================

    getAll(){


        return this.surveys;


    },





    // ========================================================
    // UPDATE DATA MANUALLY
    // USED BY REALTIME
    // ========================================================

    set(data){


        this.surveys =
            Array.isArray(data)
            ?
            data
            :
            [];


    },





    // ========================================================
    // CLEAR DATA
    // ========================================================

    clear(){


        this.surveys = [];


    },





    // ========================================================
    // COUNT
    // ========================================================

    count(){


        return this.surveys.length;


    }


};




console.log(
    "✅ DataStore v3.3 initialized"
);
