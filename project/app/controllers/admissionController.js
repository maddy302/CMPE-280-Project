var Admission = require('../models/admission');

exports.admission_list_all_get = function (req, res) {
    Admission.find()
        .limit(50)
        .exec(function (err, admissions) {
          if (err) { return next(err); }
          else {
            // Success, return a list of admission objects
            res.render('view_all', { title: 'Ajax tab 2', admissions: admissions});
          }
        })
};

exports.admission_search_post = function (req, res, next) {
  // Default values
  var gre_lower_bound = req.body.gre_lower_bound || 260;
  var gre_upper_bound = req.body.gre_upper_bound || 340;
  var toefl_lower_bound = req.body.toefl_lower_bound || 0;
  var toefl_upper_bound = req.body.toefl_upper_bound || 120;

  var query = Admission.find({
    'gre': {
      '$gt': gre_lower_bound,
      '$lt': gre_upper_bound
    },
    'toefl': {
      '$gt': toefl_lower_bound,
      '$lt': toefl_upper_bound
    }
  });

  query.select('gre_score, toefl_score, gpa, research, chance_of_admit');
  query.limit(50);
  // execute the query at a later time
  query.exec(function (err, admissions) {
      if (err) { return next(err); }
      res.json({ status: 1, payload: admissions })
  })
}

exports.admission_create_post = function (req, res, next) {
    var obj = new Admission(
        {
            toefl: req.body.toefl_score,
            gre_score: req.body.gre_score,
            gpa: req.body.gpa,
            research: req.body.research,
            chance_of_admit: req.body.chance_of_admit
        }
    );
    // Save new admission.
    obj.save(function (err) {
        if (err) { return next(err); }
        // Success
        // You can access the ObjectId by using obj.id
        res.json({ status: 1, payload: obj });
    });
};

exports.admission_update_post = function (req, res, next) {
    Admission.findByIdAndUpdate(req.params.id, req.body, function (err, obj) {
        if (err) { return next(err); }
        else {
            // Successful - return status code 1
            res.json({ status: 1 });
        }
    });
};

exports.admission_delete_post = function (req, res, next) {
    Admission.findByIdAndRemove(req.params.id, function deleteAdmission(err) {
        if (err) { return next(err); }
        else {
            // Success
            res.json({ status: 1 })
        }
    })
};
