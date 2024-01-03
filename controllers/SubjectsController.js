const { gql } = require("apollo-server-express");
const Subject = require("../models/Subject");

const SubjecttypeDefs = gql`
  type Subject {
    id: ID
    name: String,
    dateStart: String,
    dateEnd: String,
    color: String,
    description: String,
    opinion: String,
    difficulty: Int,
    status: String,
    id_semestre: String,
  }

  input SubjectInput {
    name: String
    dateStart: String
    dateEnd: String
    color: String
    description: String
    opinion: String
    difficulty: Int
    status: String
    id_semestre: String
  }   

  type Query {
    helloSubject: String,
    getAllSubjects: [Subject],
  }
  type Mutation {
    createSubject(SubjectInput: SubjectInput): Subject,
    deleteSubject(id: ID): String
    updateSubjectState(id: ID!, newState: String!): Subject
  }
`; 

const Subjectresolvers = {
    Query: {
        helloSubject: () => "Hello world",
        getAllSubjects: async () => {
            const subjects = await Subject.find();  
            return subjects; 
          },
    },
    Mutation: {
        async createSubject(parent, { SubjectInput }, { io }, context, info) {
          const { name, dateStart, dateEnd, color, description, opinion, difficulty, status, id_semestre  } = SubjectInput; 
          const newSubject = new Subject({ name, dateStart, dateEnd, color, description, opinion, difficulty, status, id_semestre });
          await newSubject.save();
          io.emit('subjectCreada', { status: "ok", message: "Se ha creado una Asignatura" });
          return newSubject;
        },
        async deleteSubject(_, { id }, { io }) {
            await Subject.findByIdAndDelete(id);
            io.emit('subjectEliminada', { status: "ok", message: "Se ha eliminado una Asignatura" });
            return "Task Deleted";
        },
        async updateSubjectState(_, { id, newState }) {
          try {
              const subject = await Subject.findById(id);
              if (!subject) {
                  throw new Error("La asignatura no fue encontrada.");
              }
  
              // Actualiza el estado de la asignatura con el nuevo estado proporcionado
              subject.estado = newState;
              await subject.save();
  
              return subject;
          } catch (error) {
              throw new Error(`Error al actualizar el estado de la asignatura: ${error}`);
          }
      },
    }
  };

  module.exports = {
    SubjecttypeDefs,
    Subjectresolvers,
  };