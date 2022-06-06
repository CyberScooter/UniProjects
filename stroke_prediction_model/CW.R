#  clears all objects in "global environment" 
rm(list=ls()) 

# clears the console area 
cat("\014") 

# Starts random numbers at the same sequence 
set.seed(123)
library(DataExplorer)
#DataExplorer::create_report(stroke_dataset)
#to install dmwr use command below
#remotes::install_github("cran/DMwR")
library(DMwR)
library(caret)
library(ggplot2)
library(plotROC)
library(MLeval)
library(MLmetrics)
library(ROSE)

myLibraries<-c("mltools", "data.table", "caret", "dplyr", "magrittr", "sqldf") 

library(pacman) 
pacman::p_load(char=myLibraries,install=TRUE,character.only=TRUE)

# Drop id column
stroke_dataset <- read.csv("dataset.csv", colClasses = c(id = "NULL"))

# Round age column to nearest integer
stroke_dataset$age <- round(stroke_dataset$age)

# Convert 'N/A' values to 'NA' values for all columns
stroke_dataset[stroke_dataset == "N/A"] <- NA

stroke_dataset[stroke_dataset == ""] <- "Unknown"
# Drop rows if bmi value is NA
stroke_dataset <- na.omit(stroke_dataset)

# Remove 'other' gender for one patient in row 768
stroke_dataset <- stroke_dataset[stroke_dataset$gender != "Other",]

# One-hot encode ever_married to 1 - Yes, 0 - No
stroke_dataset$ever_married[stroke_dataset$ever_married == "Yes"] <- 1
stroke_dataset$ever_married[stroke_dataset$ever_married == "No"] <- 0

# One-hot encode gender to 1 - Male, 0 - Female
stroke_dataset$gender[stroke_dataset$gender == "Male"] <- 1
stroke_dataset$gender[stroke_dataset$gender == "Female"] <- 0

# One-hot encode Residence_type to 1 - Urban, 0 - Rural
stroke_dataset$Residence_type[stroke_dataset$Residence_type == "Urban"] <- 1
stroke_dataset$Residence_type[stroke_dataset$Residence_type == "Rural"] <- 0

# Using caret package - one-hot encode work_type and smoking_status
dummy1 <- dummyVars(~ work_type, data=stroke_dataset)
one_hot_worktype <- data.frame(predict(dummy1, newdata=stroke_dataset))

dummy2 <- dummyVars(~ smoking_status, data=stroke_dataset)
one_hot_smoking_status <- data.frame(predict(dummy2, newdata=stroke_dataset))

# Replace work_type and smoking_status column with new one_hot encoding
stroke_dataset <- stroke_dataset %>% select(-one_of('work_type', 'smoking_status'))
stroke_dataset <- cbind(stroke_dataset, one_hot_worktype)
stroke_dataset <- cbind(stroke_dataset, one_hot_smoking_status)


#str(stroke_dataset)
# Convert all character columns (gender, bmi, and ever_married, Residence_type) to numeric type
stroke_dataset %<>% mutate_if(is.character, as.numeric)
# Convert all integer columns to numeric type
stroke_dataset %<>% mutate_if(is.integer, as.numeric)
str(stroke_dataset)

# Reformat row numbers (this function doesn't do anything else)
stroke_dataset <- one_hot(as.data.table(stroke_dataset))

# Randomise dataset for splitting
stroke_dataset <- stroke_dataset[order(runif(nrow(stroke_dataset))),]

# Write to csv
#write.csv(stroke_dataset, "preprocessed_stroke_dataset_2.csv", row.names = FALSE)



#recall value as the summary function for the models
f2 <- function(data, lev = NULL, model = NULL) {
  f2_val <- Recall(y_pred = data$pred, y_true = data$obs, positive = lev[1])
  c(F2 = f2_val)
}


#Convert to dataframe with specified column types
stroke_dataset <- transform(
  stroke_dataset,
  age = as.integer(age),
  gender = as.factor(gender),
  hypertension = as.factor(hypertension),
  heart_disease = as.factor(heart_disease),
  ever_married = as.factor(ever_married),
  Residence_type = as.factor(Residence_type),
  avg_glucose_level = as.numeric(avg_glucose_level),
  bmi = as.numeric(bmi),
  work_typechildren = as.factor(work_typechildren),
  work_typeGovt_job = as.factor(work_typeGovt_job),
  work_typeNever_worked = as.factor(work_typeNever_worked),
  work_typePrivate = as.factor(work_typePrivate),
  work_typeSelf.employed = as.factor(work_typeSelf.employed),
  smoking_statusformerly.smoked = as.factor(smoking_statusformerly.smoked),
  smoking_statusnever.smoked = as.factor(smoking_statusnever.smoked),
  smoking_statussmokes = as.factor(smoking_statussmokes),
  smoking_statusUnknown = as.factor(smoking_statusUnknown),
  stroke = as.factor(stroke)
)

#remove these input variables
drops <- c("work_typechildren","work_typeNever_worked","work_typeGovt_job",
           "Residence_type","smoking_statusUnknown")
#drop_stroke<-stroke_dataset[ , !(names(stroke_dataset) %in% drops)]
stroke_dataset<-stroke_dataset[ , !(c("work_typechildren","work_typeNever_worked","work_typeGovt_job",
                                     "Residence_type","smoking_statusUnknown"))]
#smote subsampling technique on the preprocessed data
smote_train <- SMOTE(stroke ~.,data=stroke_dataset)

smote_train$stroke <-ifelse(smote_train$stroke == "1", "yes", "no")

smote_train <- transform(
  smote_train,
  stroke = as.factor(stroke)
)

#randomly shuffle dataframe after smote generation
smote_train <- smote_train[order(runif(nrow(smote_train))),]
smote_train<- smote_train[sample(nrow(smote_train)),]

#split dataset into 90:10 split
training_records <-round(nrow(smote_train)*(90/100))
training_data <- smote_train[(1:training_records),]
testing_data = smote_train[-(1:training_records),]

control <- trainControl(method="repeatedcv", number=10, repeats=3,classProbs = TRUE,
                        savePredictions ="final", verboseIter = TRUE,
                        summaryFunction = f2)

lda <- train(stroke~., data=training_data,metric="Accuracy", method="lda", 
             trControl=control)
rf_model <- train(stroke~.,data=training_data,method="rf", 
                  trControl=control)
#tree <- train(stroke~., data=training_data, metric="Accuracy",method="treebag", trControl=control)
adaboost = train(stroke~., data=training_data, method='adaboost', tuneLength=2,
                 trControl = control)

#plotting comparative results
results <- resamples(list(lda=lda,rf=rf_model,adaboost=adaboost))
print(summary(results))
accuracy_results_graph <- bwplot(results)
plot(accuracy_results_graph)
boxplot(results)


#look at the variable importance of the model and what input variable affected it the most.
varimp_mars <- varImp(rf_model)
print(varimp_mars)
graph1 <- plot(varimp_mars, main="Variable Importance")
graph2 <- plot(rf_model, main="Model Accuracies")
plot(graph1)
plot(graph2)

#kfold confusion matrix
cm <- confusionMatrix(data = rf_model$pred$pred, rf_model$pred$obs,
                      mode = "everything", positive="yes")
cm
fourfoldplot(cm$table, color = c("lightsteelblue1", "mistyrose"),
             conf.level = 0, margin = 1, main = "Random Forest K-Fold")

#Testing against unseen data

predicted_rf_result <- predict(rf_model, newdata = testing_data)

cm <- confusionMatrix(data = predicted_rf_result, testing_data$stroke,
                      mode = "everything", positive="yes")
cm
fourfoldplot(cm$table, color = c("lightsteelblue1", "mistyrose"),
             conf.level = 0, margin = 1, main = "Random Forest Unseen")

#Roc results
twoClassSummary(rf_model$pred, lev = levels(rf_model$pred$obs))

#pr results
prSummary(rf_model$pred, lev = levels(rf_model$pred$obs))


roc <-evalm(list(rf_model,adaboost,lda),gnames=c('random_forest','adaboost','lda'),
            positive = "yes",plots = c("prg","pr", "r", "cc"))

save(rf_model, file="ad.RData")

