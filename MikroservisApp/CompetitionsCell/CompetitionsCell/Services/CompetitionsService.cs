﻿using CompetitionsCell.Interfaces;
using System.Text;
using System.Text.Json;
using CompetitionsCell.Entities;
using Microsoft.EntityFrameworkCore;

namespace CompetitionsCell.Services
{
    public class UserRegisteredForCompetition
    {
        public int UserId { get; set; }
        public int CompetitionId { get; set; }

        public string UserEmail { get; set; }
    }

    public class CreateCompetition
    {
        public string? Description { get; set; }
        public string? Title { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string? Location { get; set; }
    }

    public class CreateWorkout
    {
        public string? Description { get; set; }
        public string? Title { get; set; }

        public int? CompetitionId { get; set; }

        public int ScoreType { get; set; }
    }

    public class CreateCompetitionPayment
    {
        public int UserId { get; set; }
        public int CompetitionId { get; set; }
        public string UserEmail { get; set; }
        public double Price { get; set; }
        public double Tax { get; set; }
        public double Total { get; set; }
    }

    public class CompetitionsService : ICompetitionsService
    {
        private AppDbContext _context;

        public IRabbitMqSender _rabbitMqSenderNotifications;
        public IRabbitMqSender _rabbitMqSenderPayments;
        public CompetitionsService(AppDbContext context)
        {
            _rabbitMqSenderNotifications = new RabbitMqSender("SendNotification", "competition-notification", "competition-notification");
            _rabbitMqSenderPayments = new RabbitMqSender("SendPayment", "competition-payment", "competition-payment");
            _context = context;
        }

        public async Task<List<Competition>> GetAll()
        {
            return _context.Competitions.ToList();
        }

        public async Task<Competition?> Get(int id)
        {
            return _context.Competitions.Where(t => t.Id == id).SingleOrDefault();
        }

        public async Task CreateWorkout(CreateWorkout request)
        {
            var entity = new Workout
            {
                Description = request.Description,
                Title = request.Title,
                CompetitionId = request.CompetitionId,
                ScoreType = request.ScoreType
            };

            _context.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateWorkout(Workout request)
        {
            var entity = _context.Workouts.Where(t => t.Id == request.Id).SingleOrDefault();

            entity.Title = request.Title;
            entity.Description = request.Description;

            await _context.SaveChangesAsync();
        }

        public async Task RegisterUserForCompetition(UserRegisteredForCompetition request)
        {
            var entity = new CompetitionMembership
            {
                UserId = request.UserId,
                CompetitionId = request.CompetitionId,
                UserEmail = request.UserEmail,
            };
            _context.Add(entity);
            //await _context.SaveChangesAsync();

            byte[] messageBodyBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(request));

            await _rabbitMqSenderNotifications.SendMessage(messageBodyBytes); //obavijesti notifications
        }

        public async Task PayCompetitionMembership(CreateCompetitionPayment request)
        {
            byte[] messageBodyBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(request));

            await _rabbitMqSenderPayments.SendMessage(messageBodyBytes);
        }

        public async Task UpdateScore(Result request)
        {
            var entity = _context.Results.Where(t => t.Id == request.Id).SingleOrDefault();

            if (entity == null)
            {
                //TODO provjeriti radi li ovo
                request.Workout = null;
                _context.Add(request);
            }
            else
            {
                entity.Score = request.Score;
            }

            await _context.SaveChangesAsync();
        }
    }
}
